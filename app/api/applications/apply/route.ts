import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withStudent } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

// POST /api/applications/apply - Submit a new hostel application
export const POST = withStudent(async (request: AuthenticatedRequest) => {
    const client = await pool.connect();
    try {
        const body = await request.json();
        const { hostelBlockId, applicationData } = body;

        // Securely fetch the student ID from the database using the authenticated user ID
        const studentLookupRes = await client.query(
            'SELECT id FROM students WHERE user_id = $1',
            [request.user.id]
        );
        const studentId = studentLookupRes.rows[0]?.id;

        // Validation
        if (!studentId || !hostelBlockId) {
            return NextResponse.json(
                { error: 'Student profile not found or missing Hostel Block ID' },
                { status: 400 }
            );
        }

        await client.query('BEGIN');

        // Check if student already has an active application for this hostel
        const existingAppRes = await client.query(
            `SELECT 1 FROM hostel_applications 
             WHERE student_id = $1 AND hostel_block_id = $2 AND status = 'Pending'`,
            [studentId, hostelBlockId]
        );

        if ((existingAppRes.rowCount ?? 0) > 0) {
            await client.query('ROLLBACK');
            return NextResponse.json(
                { error: 'You already have a pending application for this hostel' },
                { status: 400 }
            );
        }

        // Insert Application
        const insertAppRes = await client.query(
            `INSERT INTO hostel_applications (student_id, hostel_block_id, status, application_data)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [studentId, hostelBlockId, 'Pending', applicationData]
        );
        const application = insertAppRes.rows[0];

        // Update student enrollment status
        // Note: application_date column missing in schema, relying on hostel_applications.created_at
        await client.query(
            `UPDATE students 
             SET enrollment_status = 'Applied', updated_at = NOW()
             WHERE id = $1`,
            [studentId]
        );

        await client.query('COMMIT');

        // Transform response to match Mongoose format (camelCase)
        const responseData = {
            ...application,
            _id: application.id,
            studentId: application.student_id,
            hostelBlockId: application.hostel_block_id,
            applicationData: application.application_data,
            createdAt: application.created_at
        };

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            data: responseData
        });

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error submitting application:', error);
        return NextResponse.json(
            { error: 'Failed to submit application', details: error.message },
            { status: 500 }
        );
    } finally {
        client.release();
    }
});

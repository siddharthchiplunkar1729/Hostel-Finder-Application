import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withWarden } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

// PATCH /api/applications/[id]/review - Warden reviews (Accept/Reject) an application
export const PATCH = withWarden(async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const client = await pool.connect();
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, notes } = body;
        const wardenId = request.user.id;

        if (!['Accepted', 'Rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid application status' },
                { status: 400 }
            );
        }

        await client.query('BEGIN');

        // Update Application
        const updateAppRes = await client.query(
            `UPDATE hostel_applications 
             SET status = $1, notes = $2, reviewed_by = $3, reviewed_date = NOW()
             WHERE id = $4
             RETURNING *`,
            [status, notes, wardenId, id]
        );

        if (updateAppRes.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        const application = updateAppRes.rows[0];
        const studentId = application.student_id;
        const hostelBlockId = application.hostel_block_id;

        // If accepted, update student status and assign hostel
        if (status === 'Accepted') {
            await client.query(
                `UPDATE students 
                 SET enrollment_status = 'Accepted', hostel_block_id = $1, updated_at = NOW()
                 WHERE id = $2`,
                [hostelBlockId, studentId]
            );

            // Fetch user_id from students table to update users table
            const studentRes = await client.query('SELECT user_id FROM students WHERE id = $1', [studentId]);
            const userId = studentRes.rows[0]?.user_id;

            if (userId) {
                await client.query(
                    `UPDATE users 
                     SET can_access_dashboard = true
                     WHERE id = $1`,
                    [userId]
                );
            }

            // Decrement available rooms (Optional but recommended)
            await client.query(
                `UPDATE hostel_blocks 
                 SET available_rooms = GREATEST(available_rooms - 1, 0), 
                     occupied_rooms = occupied_rooms + 1
                 WHERE id = $1`,
                [hostelBlockId]
            );

        } else if (status === 'Rejected') {
            await client.query(
                `UPDATE students 
                 SET enrollment_status = 'Rejected', hostel_block_id = NULL, updated_at = NOW()
                 WHERE id = $1`,
                [studentId]
            );

            const studentRes = await client.query('SELECT user_id FROM students WHERE id = $1', [studentId]);
            const userId = studentRes.rows[0]?.user_id;

            if (userId) {
                await client.query(
                    `UPDATE users 
                     SET can_access_dashboard = false
                     WHERE id = $1`,
                    [userId]
                );
            }
        }

        await client.query('COMMIT');

        // Map response
        const responseData = {
            ...application,
            _id: application.id,
            status: application.status,
            studentId: application.student_id,
            hostelBlockId: application.hostel_block_id
        };

        return NextResponse.json({
            success: true,
            message: `Application ${status.toLowerCase()} successfully`,
            data: responseData
        });

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error reviewing application:', error);
        return NextResponse.json(
            { error: 'Failed to review application', details: error.message },
            { status: 500 }
        );
    } finally {
        client.release();
    }
});

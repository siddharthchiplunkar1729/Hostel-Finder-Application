import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withStudent } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withStudent(async (request: AuthenticatedRequest) => {
    try {
        // Securely fetch the student ID from the database using the authenticated user ID
        const studentLookupRes = await pool.query(
            'SELECT id FROM students WHERE user_id = $1',
            [request.user.id]
        );
        const studentId = studentLookupRes.rows[0]?.id;

        if (!studentId) {
            return NextResponse.json(
                { error: 'Student profile not found' },
                { status: 404 }
            );
        }

        const result = await pool.query(`
            SELECT ha.*, hb.block_name, hb.type, hb.location 
            FROM hostel_applications ha
            JOIN hostel_blocks hb ON ha.hostel_block_id = hb.id
            WHERE ha.student_id = $1
            ORDER BY ha.created_at DESC
        `, [studentId]);

        const applications = result.rows.map(row => ({
            ...row,
            _id: row.id,
            hostelBlockId: {
                _id: row.hostel_block_id,
                blockName: row.block_name,
                type: row.type,
                location: row.location
            }
        }));

        return NextResponse.json(applications);

    } catch (error: any) {
        console.error('Error fetching student applications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
});

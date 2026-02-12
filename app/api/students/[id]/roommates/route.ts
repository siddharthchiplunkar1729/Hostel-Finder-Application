import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withStudent } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withStudent(async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;

        // Security check: Match URL student ID with authenticated user ID
        const ownershipCheck = await pool.query(
            'SELECT 1 FROM students WHERE id = $1 AND user_id = $2',
            [id, request.user.id]
        );

        if (ownershipCheck.rowCount === 0) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // 1. Get current student's block and room
        const studentRes = await pool.query(
            'SELECT hostel_block_id, room_number FROM students WHERE id = $1',
            [id]
        );
        const student = studentRes.rows[0];

        if (!student || !student.hostel_block_id || !student.room_number) {
            return NextResponse.json({ success: true, roommates: [] });
        }

        // 2. Find others in the same room
        const roommatesRes = await pool.query(`
            SELECT s.id, u.name, u.email, s.photo, s.course, s.year 
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.hostel_block_id = $1 
              AND s.room_number = $2 
              AND s.id != $3
        `, [student.hostel_block_id, student.room_number, id]);

        return NextResponse.json({
            success: true,
            roommates: roommatesRes.rows.map(r => ({ ...r, _id: r.id }))
        });
    } catch (error: any) {
        console.error('Error fetching roommates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch roommates' },
            { status: 500 }
        );
    }
});

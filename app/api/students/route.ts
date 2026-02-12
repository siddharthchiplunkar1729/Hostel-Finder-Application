import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const course = searchParams.get('course');
        const year = searchParams.get('year');
        const blockId = searchParams.get('blockId');

        let query = `
            SELECT s.*, u.name, u.email, u.phone, hb.block_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN hostel_blocks hb ON s.hostel_block_id = hb.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (course) {
            query += ` AND s.course = $${paramIndex}`;
            params.push(course);
            paramIndex++;
        }
        if (year) {
            query += ` AND s.year = $${paramIndex}`;
            params.push(parseInt(year));
            paramIndex++;
        }
        if (blockId) {
            query += ` AND s.hostel_block_id = $${paramIndex}`;
            params.push(blockId);
            paramIndex++;
        }

        query += ' ORDER BY s.created_at DESC';

        const res = await pool.query(query, params);

        const students = res.rows.map(row => ({
            _id: row.id,
            userId: row.user_id,
            rollNumber: row.roll_number,
            course: row.course,
            year: row.year,
            department: row.department,
            hostelBlockId: row.hostel_block_id ? {
                _id: row.hostel_block_id,
                blockName: row.block_name
            } : null,
            roomNumber: row.room_number,
            enrollmentStatus: row.enrollment_status,
            name: row.name,
            email: row.email,
            phone: row.phone
        }));

        return NextResponse.json(students);
    } catch (error: any) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, rollNumber, course, year, department, hostelBlockId, roomNumber } = body;

        const res = await pool.query(
            `INSERT INTO students (user_id, roll_number, course, year, department, hostel_block_id, room_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, rollNumber, course, year, department, hostelBlockId, roomNumber]
        );

        return NextResponse.json({ ...res.rows[0], _id: res.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating student:', error);
        return NextResponse.json(
            { error: 'Failed to create student', details: error.message },
            { status: 500 }
        );
    }
}

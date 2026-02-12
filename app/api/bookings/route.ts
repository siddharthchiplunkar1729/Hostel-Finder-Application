import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { hostelId, studentId, checkIn, checkOut, amount } = body;

        if (!hostelId || !checkIn || !checkOut) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await pool.query(
            `INSERT INTO bookings (hostel_block_id, student_id, check_in, check_out, amount, status)
             VALUES ($1, $2, $3, $4, $5, 'Confirmed')
             RETURNING *`,
            [hostelId, studentId, checkIn, checkOut, amount || 0]
        );

        return NextResponse.json({ ...result.rows[0], _id: result.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

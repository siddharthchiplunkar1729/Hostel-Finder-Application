import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');
        const type = searchParams.get('type');
        const minRating = searchParams.get('minRating');

        let query = 'SELECT * FROM hostel_blocks WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (location) {
            query += ` AND (block_name ILIKE $${paramIndex} OR location ILIKE $${paramIndex})`;
            params.push(`%${location}%`);
            paramIndex++;
        }

        if (type) {
            query += ` AND type = $${paramIndex}`;
            params.push(type);
            paramIndex++;
        }

        if (minRating) {
            query += ` AND rating >= $${paramIndex}`;
            params.push(parseFloat(minRating));
            paramIndex++;
        }

        const result = await pool.query(query, params);

        // Map to camelCase for frontend compatibility if needed, 
        // but often the frontend handles snake_case since I've been standardizing.
        // Actually, let's keep it consistent with the frontend expected fields.
        const hostels = result.rows.map(row => ({
            ...row,
            _id: row.id,
            name: row.block_name,
            messAvailable: row.facilities?.includes('Mess') || false
        }));

        return NextResponse.json(hostels);
    } catch (error: any) {
        console.error('Error fetching hostels:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { blockName, type, location, totalRooms, facilities, images } = body;

        const result = await pool.query(
            `INSERT INTO hostel_blocks (block_name, type, location, total_rooms, available_rooms, facilities, images)
             VALUES ($1, $2, $3, $4, $4, $5, $6)
             RETURNING *`,
            [blockName, type, location, totalRooms, facilities, images]
        );

        return NextResponse.json({ ...result.rows[0], _id: result.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating hostel:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

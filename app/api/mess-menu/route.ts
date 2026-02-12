import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const blockId = searchParams.get('blockId');
        const day = searchParams.get('day');
        const date = searchParams.get('date'); // Add date support if needed, or map to day

        let query = `
            SELECT mm.*, hb.block_name 
            FROM mess_menu mm
            LEFT JOIN hostel_blocks hb ON mm.hostel_block_id = hb.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (blockId) {
            query += ` AND mm.hostel_block_id = $${paramIndex}`;
            params.push(blockId);
            paramIndex++;
        }
        if (day) {
            query += ` AND mm.day ILIKE $${paramIndex}`;
            params.push(day);
            paramIndex++;
        }

        const res = await pool.query(query, params);

        const mapMeal = (mealType: string, items: string, timings: string, calories: number) => ({
            mealType,
            items: items ? items.split(',').map(i => i.trim()) : [],
            timings,
            calories
        });

        const mappedMenus = res.rows.map(row => ({
            _id: row.id,
            date: new Date().toISOString(), // Mock date for UI consistency
            day: row.day,
            hostelName: row.block_name,
            meals: [
                mapMeal('Breakfast', row.breakfast, '07:30 AM - 09:30 AM', 450),
                mapMeal('Lunch', row.lunch, '12:30 PM - 02:30 PM', 850),
                mapMeal('Snacks', row.snacks, '04:30 PM - 05:30 PM', 300),
                mapMeal('Dinner', row.dinner, '07:30 PM - 09:30 PM', 750)
            ]
        }));

        return NextResponse.json(day ? mappedMenus[0] : mappedMenus);
    } catch (error: any) {
        console.error('Error fetching mess menu:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mess menu' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { hostelBlockId, day, breakfast, lunch, snacks, dinner } = body;

        const res = await pool.query(
            `INSERT INTO mess_menu (hostel_block_id, day, breakfast, lunch, snacks, dinner)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [hostelBlockId, day, breakfast, lunch, snacks, dinner]
        );

        return NextResponse.json({ ...res.rows[0], _id: res.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating mess menu:', error);
        return NextResponse.json(
            { error: 'Failed to create mess menu', details: error.message },
            { status: 500 }
        );
    }
}

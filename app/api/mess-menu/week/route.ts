import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hostelBlockId = searchParams.get('hostelBlockId');

        // Fetch all 7 days for the specified block (or first block found if not specified)
        let query = `
            SELECT mm.*, hb.block_name 
            FROM mess_menu mm
            LEFT JOIN hostel_blocks hb ON mm.hostel_block_id = hb.id
            WHERE 1=1
        `;
        const params: any[] = [];
        if (hostelBlockId) {
            query += ` AND mm.hostel_block_id = $1`;
            params.push(hostelBlockId);
        }

        query += ` ORDER BY CASE 
            WHEN mm.day = 'Monday' THEN 1
            WHEN mm.day = 'Tuesday' THEN 2
            WHEN mm.day = 'Wednesday' THEN 3
            WHEN mm.day = 'Thursday' THEN 4
            WHEN mm.day = 'Friday' THEN 5
            WHEN mm.day = 'Saturday' THEN 6
            WHEN mm.day = 'Sunday' THEN 7
            ELSE 8 END`;

        const result = await pool.query(query, params);

        const mapMeal = (mealType: string, items: string, timings: string) => ({
            mealType,
            items: items ? items.split(',').map(i => i.trim()) : [],
            timings
        });

        const menus = result.rows.map(row => ({
            _id: row.id,
            day: row.day,
            date: new Date().toISOString(), // Hackathon placeholder
            hostelName: row.block_name,
            meals: [
                mapMeal('Breakfast', row.breakfast, '07:30 AM - 09:30 AM'),
                mapMeal('Lunch', row.lunch, '12:30 PM - 02:30 PM'),
                mapMeal('Snacks', row.snacks, '04:30 PM - 05:30 PM'),
                mapMeal('Dinner', row.dinner, '07:30 PM - 09:30 PM')
            ]
        }));

        return NextResponse.json({
            success: true,
            menus,
            count: menus.length
        });

    } catch (error: any) {
        console.error('Error fetching weekly menu:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weekly menu' },
            { status: 500 }
        );
    }
}


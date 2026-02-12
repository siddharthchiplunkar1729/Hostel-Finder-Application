import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const result = await pool.query('SELECT * FROM communities ORDER BY member_count DESC');
        return NextResponse.json(result.rows.map(r => ({ ...r, _id: r.id })));
    } catch (error: any) {
        console.error('Error fetching communities:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, image } = body;

        const result = await pool.query(
            `INSERT INTO communities (name, description, image)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, description, image]
        );

        return NextResponse.json({ ...result.rows[0], _id: result.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating community:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query = `
            SELECT s.*, u.name as user_name 
            FROM stories s
            JOIN users u ON s.user_id = u.id
            WHERE 1=1
        `;
        const params: any[] = [];
        if (userId) {
            query += ` AND s.user_id = $1`;
            params.push(userId);
        }

        query += ` ORDER BY s.created_at DESC LIMIT 20`;

        const result = await pool.query(query, params);

        const stories = result.rows.map(row => ({
            ...row,
            _id: row.id,
            author: { name: row.user_name }
        }));

        return NextResponse.json(stories);
    } catch (error: any) {
        console.error('Error fetching stories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, title, content, image, tags } = body;

        const result = await pool.query(
            `INSERT INTO stories (user_id, title, content, image, tags)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [userId, title, content, image, tags]
        );

        return NextResponse.json({ ...result.rows[0], _id: result.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating story:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

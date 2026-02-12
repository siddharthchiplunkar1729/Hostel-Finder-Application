import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { userId, userType, text, parentId } = body;

        const result = await pool.query(
            `INSERT INTO hostel_comments (hostel_block_id, user_id, user_type, comment_text, parent_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [id, userId, userType, text, parentId || null]
        );

        return NextResponse.json({ success: true, comment: { ...result.rows[0], _id: result.rows[0].id } });
    } catch (error: any) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await pool.query(`
            SELECT c.*, u.name as user_name 
            FROM hostel_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.hostel_block_id = $1
            ORDER BY c.created_at ASC
        `, [id]);

        return NextResponse.json(result.rows.map(r => ({ ...r, _id: r.id, user: { name: r.user_name } })));
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

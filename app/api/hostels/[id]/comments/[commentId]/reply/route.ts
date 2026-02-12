import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST /api/hostels/[id]/comments/[commentId]/reply - Reply to a comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, commentId: string }> }
) {
    try {
        const { id, commentId } = await params;
        const body = await request.json();
        const { userId, text, userType } = body;

        const result = await pool.query(
            `INSERT INTO hostel_comments (hostel_block_id, user_id, user_type, comment_text, parent_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [id, userId, userType || 'Student', text, commentId]
        );

        const newReply = result.rows[0];

        return NextResponse.json({
            success: true,
            reply: { ...newReply, _id: newReply.id }
        });
    } catch (error: any) {
        console.error('Error replying to comment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, reviewId: string }> }
) {
    try {
        const { reviewId } = await params;

        const result = await pool.query(
            `UPDATE reviews 
             SET helpful = helpful + 1 
             WHERE id = $1 
             RETURNING helpful`,
            [reviewId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, helpfulCount: result.rows[0].helpful });
    } catch (error: any) {
        console.error('Error marking review as helpful:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

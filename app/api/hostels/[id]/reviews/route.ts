import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const reviewsRes = await pool.query(
            'SELECT r.*, u.name as student_name FROM reviews r JOIN students s ON r.student_id = s.id JOIN users u ON s.user_id = u.id WHERE r.hostel_block_id = $1 ORDER BY r.created_at DESC',
            [id]
        );

        const statsRes = await pool.query(
            'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE hostel_block_id = $1',
            [id]
        );

        const stats = statsRes.rows[0];

        return NextResponse.json({
            reviews: reviewsRes.rows.map(r => ({ ...r, _id: r.id })),
            averageRating: parseFloat(stats.average_rating || '0'),
            totalReviews: parseInt(stats.total_reviews || '0')
        });
    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const client = await pool.connect();
    try {
        const { id } = await params;
        const body = await request.json();
        const { studentId, rating, reviewText } = body;

        await client.query('BEGIN');

        const insertRes = await client.query(
            `INSERT INTO reviews (student_id, hostel_block_id, rating, review_text)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [studentId, id, rating, reviewText]
        );

        // Update overall rating in hostel_blocks
        await client.query(
            `UPDATE hostel_blocks 
             SET rating = (SELECT AVG(rating) FROM reviews WHERE hostel_block_id = $1)
             WHERE id = $1`,
            [id]
        );

        await client.query('COMMIT');

        return NextResponse.json({ success: true, review: { ...insertRes.rows[0], _id: insertRes.rows[0].id } });
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error posting review:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}

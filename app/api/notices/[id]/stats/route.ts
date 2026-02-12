import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const acknowledgementsRes = await pool.query(`
            SELECT na.acknowledged_at, u.name, u.email, s.photo
            FROM notice_acknowledgements na
            JOIN students s ON na.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE na.notice_id = $1
            ORDER BY na.acknowledged_at DESC
        `, [id]);

        return NextResponse.json({
            success: true,
            noticeId: id,
            totalAcknowledgements: acknowledgementsRes.rowCount,
            acknowledgements: acknowledgementsRes.rows
        });

    } catch (error: any) {
        console.error('Error fetching notice stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notice stats' },
            { status: 500 }
        );
    }
}

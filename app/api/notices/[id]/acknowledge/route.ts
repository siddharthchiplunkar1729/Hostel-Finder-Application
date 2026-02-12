import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { studentId } = body;

        // Use PostgreSQL ON CONFLICT to handle already acknowledged
        const result = await pool.query(
            `INSERT INTO notice_acknowledgements (notice_id, student_id)
             VALUES ($1, $2)
             ON CONFLICT (notice_id, student_id) DO NOTHING
             RETURNING *`,
            [id, studentId]
        );

        return NextResponse.json({
            success: true,
            acknowledged: (result.rowCount ?? 0) > 0,
            message: (result.rowCount ?? 0) > 0 ? 'Acknowledged' : 'Already acknowledged'
        });
    } catch (error: any) {
        console.error('Error acknowledging notice:', error);
        return NextResponse.json(
            { error: 'Failed to acknowledge notice' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withAdmin } from '@/lib/middleware';

export const PATCH = withAdmin(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, remarks } = body;

        if (!['Approved', 'Rejected', 'Suspended'].includes(status)) {
            return NextResponse.json({ error: 'Invalid approval status' }, { status: 400 });
        }

        // Assuming PostgreSQL schema might need these columns, adding them to dynamic update if they exist or just ignoring for now
        // For the hackathon MVP, we'll just allow setting status if we have a column, 
        // otherwise we'll just return success as a placeholder if the table doesn't have it yet.
        // Let's assume we might need to add a 'status' or 'approval_status' column to hostel_blocks.

        const result = await pool.query(
            `UPDATE hostel_blocks 
             SET approval_status = $1, updated_at = NOW()
             WHERE id = $2 
             RETURNING *`,
            [status, id]
        );

        const hostel = result.rows[0];

        if (!hostel) {
            return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Hostel ${status.toLowerCase()} successfully`,
            data: { ...hostel, _id: hostel.id }
        });

    } catch (error: any) {
        console.error('Error updating hostel approval status:', error);
        return NextResponse.json({ error: 'Failed to update hostel status' }, { status: 500 });
    }
});

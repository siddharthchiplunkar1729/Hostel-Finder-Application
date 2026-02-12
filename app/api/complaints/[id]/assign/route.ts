import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { assignedTo, eta } = body;

        const result = await pool.query(
            `UPDATE complaints 
             SET assigned_to = $1, 
                 assigned_at = NOW(), 
                 eta = $2, 
                 status = 'Assigned',
                 updated_at = NOW()
             WHERE id = $3 
             RETURNING *`,
            [assignedTo, eta ? new Date(eta) : null, id]
        );

        const complaint = result.rows[0];

        if (!complaint) {
            return NextResponse.json(
                { error: 'Complaint not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            complaint: { ...complaint, _id: complaint.id },
            message: 'Complaint assigned successfully'
        });
    } catch (error: any) {
        console.error('Error assigning complaint:', error);
        return NextResponse.json(
            { error: 'Failed to assign complaint', details: error.message },
            { status: 500 }
        );
    }
}

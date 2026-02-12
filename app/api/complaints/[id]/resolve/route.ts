import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { resolutionNotes, resolutionPhotos } = body;

        const result = await pool.query(
            `UPDATE complaints 
             SET status = 'Resolved', 
                 resolved_at = NOW(), 
                 resolution_notes = $1, 
                 resolution_photos = $2,
                 updated_at = NOW()
             WHERE id = $3 
             RETURNING *`,
            [resolutionNotes, resolutionPhotos || [], id]
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
            message: 'Complaint resolved successfully'
        });
    } catch (error: any) {
        console.error('Error resolving complaint:', error);
        return NextResponse.json(
            { error: 'Failed to resolve complaint', details: error.message },
            { status: 500 }
        );
    }
}

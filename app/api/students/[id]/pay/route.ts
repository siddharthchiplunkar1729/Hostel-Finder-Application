import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withStudent } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const POST = withStudent(async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;

        // Security check: Match URL student ID with authenticated user ID
        const ownershipCheck = await pool.query(
            'SELECT 1 FROM students WHERE id = $1 AND user_id = $2',
            [id, request.user.id]
        );

        if (ownershipCheck.rowCount === 0) {
            return NextResponse.json(
                { error: 'Unauthorized: You cannot process payments for another student' },
                { status: 403 }
            );
        }

        const result = await pool.query(
            `UPDATE students 
             SET enrollment_status = 'Active', updated_at = NOW()
             WHERE id = $1 
             RETURNING *`,
            [id]
        );

        const student = result.rows[0];

        if (!student) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            data: { ...student, _id: student.id }
        });

    } catch (error: any) {
        console.error('Error processing payment:', error);
        return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
        );
    }
});

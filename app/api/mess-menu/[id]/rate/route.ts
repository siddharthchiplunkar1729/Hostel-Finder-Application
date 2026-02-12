import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { mealType, rating } = body;

        const colSuffix = rating === 'up' ? 'up' : 'down';
        const column = `${mealType.toLowerCase()}_${colSuffix}`;

        const result = await pool.query(
            `UPDATE mess_menu 
             SET ${column} = ${column} + 1 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            menu: { ...result.rows[0], _id: result.rows[0].id }
        });
    } catch (error: any) {
        console.error('Error rating meal:', error);
        return NextResponse.json(
            { error: 'Failed to rate meal' },
            { status: 500 }
        );
    }
}

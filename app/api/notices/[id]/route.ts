import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Dynamic update builder for Postgres
        const fields = Object.entries(body)
            .filter(([key]) => !['_id', 'id', 'created_at'].includes(key))
            .map(([key, value], index) => ({
                col: key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`), // camelCase to snake_case
                val: value,
                index: index + 1
            }));

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const setClause = fields.map(f => `${f.col} = $${f.index}`).join(', ');
        const values = fields.map(f => f.val);
        values.push(id);

        const query = `
            UPDATE notices 
            SET ${setClause}
            WHERE id = $${fields.length + 1} 
            RETURNING *
        `;

        const result = await pool.query(query, values);
        const updated = result.rows[0];

        if (!updated) {
            return NextResponse.json(
                { error: 'Notice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            notice: { ...updated, _id: updated.id },
            message: 'Notice updated successfully'
        });

    } catch (error: any) {
        console.error('Error updating notice:', error);
        return NextResponse.json(
            { error: 'Failed to update notice' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await pool.query('DELETE FROM notices WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Notice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Notice deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting notice:', error);
        return NextResponse.json(
            { error: 'Failed to delete notice' },
            { status: 500 }
        );
    }
}

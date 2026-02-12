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
            .filter(([key]) => !['_id', 'id', 'student_id', 'created_at'].includes(key))
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
            UPDATE complaints 
            SET ${setClause}
            WHERE id = $${fields.length + 1} 
            RETURNING *
        `;

        const result = await pool.query(query, values);
        const updated = result.rows[0];

        if (!updated) {
            return NextResponse.json(
                { error: 'Complaint not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ ...updated, _id: updated.id });
    } catch (error: any) {
        console.error('Error updating complaint:', error);
        return NextResponse.json(
            { error: 'Failed to update complaint' },
            { status: 500 }
        );
    }
}

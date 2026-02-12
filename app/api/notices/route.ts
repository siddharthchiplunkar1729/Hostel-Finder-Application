import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, withWarden } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withAuth(async (request: AuthenticatedRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const hostelBlockId = searchParams.get('hostelBlockId');
        const limit = parseInt(searchParams.get('limit') || '10');

        let query = `
            SELECT n.*, hb.block_name 
            FROM notices n
            LEFT JOIN hostel_blocks hb ON n.hostel_block_id = hb.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (hostelBlockId) {
            query += ` AND n.hostel_block_id = $${paramIndex}`;
            params.push(hostelBlockId);
            paramIndex++;
        }

        query += ` ORDER BY CASE 
            WHEN n.priority = 'Urgent' THEN 1 
            WHEN n.priority = 'High' THEN 2 
            ELSE 3 END, n.created_at DESC LIMIT $${paramIndex}`;
        params.push(limit);

        const result = await pool.query(query, params);

        const notices = result.rows.map(row => ({
            _id: row.id,
            title: row.title,
            content: row.content,
            priority: row.priority,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            hostelInfo: {
                id: row.hostel_block_id,
                name: row.block_name
            },
            type: row.priority === 'Urgent' ? 'Emergency' : 'General',
            from: {
                role: 'Administrative Officer',
                name: 'Hostel Hub System'
            }
        }));

        return NextResponse.json(notices);
    } catch (error: any) {
        console.error('Error fetching notices:', error);
        return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
    }
});

export const POST = withWarden(async (request: AuthenticatedRequest) => {
    try {
        const body = await request.json();
        const { hostelBlockId, title, content, priority, expiresAt } = body;

        const res = await pool.query(
            `INSERT INTO notices (hostel_block_id, title, content, priority, expires_at)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [hostelBlockId, title, content, priority || 'Normal', expiresAt]
        );

        return NextResponse.json({ ...res.rows[0], _id: res.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating notice:', error);
        return NextResponse.json(
            { error: 'Failed to create notice' },
            { status: 500 }
        );
    }
});

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withStudentOrWarden } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withStudentOrWarden(async (request: AuthenticatedRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        let studentId = searchParams.get('studentId');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Security check: If Student, they can only see their own complaints
        if (request.user.role === 'Student') {
            const studentLookupRes = await pool.query(
                'SELECT id FROM students WHERE user_id = $1',
                [request.user.id]
            );
            studentId = studentLookupRes.rows[0]?.id || 'none';
        }

        let query = `
            SELECT c.*, u.name as student_name, u.email as student_email, s.room_number
            FROM complaints c
            JOIN students s ON c.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (studentId) {
            query += ` AND c.student_id = $${paramIndex}`;
            params.push(studentId);
            paramIndex++;
        }
        if (status) {
            query += ` AND c.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex}`;
        params.push(limit);

        const res = await pool.query(query, params);

        const complaints = res.rows.map(row => ({
            _id: row.id,
            studentId: {
                _id: row.student_id,
                name: row.student_name,
                email: row.student_email,
                roomNumber: row.room_number
            },
            title: row.title,
            description: row.description,
            status: row.status,
            createdAt: row.created_at
        }));

        return NextResponse.json(complaints);
    } catch (error: any) {
        console.error('Error fetching complaints:', error);
        return NextResponse.json(
            { error: 'Failed to fetch complaints' },
            { status: 500 }
        );
    }
});

export const POST = withStudentOrWarden(async (request: AuthenticatedRequest) => {
    try {
        const body = await request.json();
        const { title, description } = body;

        // Securely fetch student_id for the authenticated user
        const studentLookupRes = await pool.query(
            'SELECT id FROM students WHERE user_id = $1',
            [request.user.id]
        );
        const studentId = studentLookupRes.rows[0]?.id;

        if (!studentId) {
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        const res = await pool.query(
            `INSERT INTO complaints (student_id, title, description, status)
             VALUES ($1, $2, $3, 'Pending')
             RETURNING *`,
            [studentId, title, description]
        );

        return NextResponse.json({ ...res.rows[0], _id: res.rows[0].id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating complaint:', error);
        return NextResponse.json(
            { error: 'Failed to create complaint' },
            { status: 500 }
        );
    }
});

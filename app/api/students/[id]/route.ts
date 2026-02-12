import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withStudentOrWarden } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withStudentOrWarden(async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;

        // Security check: If Student, they can only view their own profile.
        // Wardens and Admins can view any student profile.
        if (request.user.role === 'Student') {
            const ownershipCheck = await pool.query(
                'SELECT 1 FROM students WHERE id = $1 AND user_id = $2',
                [id, request.user.id]
            );

            if (ownershipCheck.rowCount === 0) {
                return NextResponse.json(
                    { error: 'Unauthorized: You can only view your own profile' },
                    { status: 403 }
                );
            }
        }

        // Fetch student with related user and hostel block info
        const result = await pool.query(`
            SELECT 
                s.*, 
                u.name, u.email, u.phone, u.role, u.can_access_dashboard,
                hb.block_name, hb.location as hostel_location
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN hostel_blocks hb ON s.hostel_block_id = hb.id
            WHERE s.id = $1
        `, [id]);

        const student = result.rows[0];

        if (!student) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        // Map to camelCase and integrated object format for frontend
        const mappedStudent = {
            _id: student.id,
            userId: student.user_id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            rollNumber: student.roll_number,
            course: student.course,
            year: student.year,
            department: student.department,
            roomNumber: student.room_number,
            enrollmentStatus: student.enrollment_status,
            photo: student.photo,
            canAccessDashboard: student.can_access_dashboard,
            hostelInfo: student.hostel_block_id ? {
                id: student.hostel_block_id,
                name: student.block_name,
                location: student.hostel_location
            } : null,
            feeStatus: {
                isPaid: student.enrollment_status === 'Active', // Simplified logic for hackathon
                lastPayment: student.updated_at
            }
        };

        return NextResponse.json(mappedStudent);
    } catch (error) {
        console.error('Error fetching student:', error);
        return NextResponse.json(
            { error: 'Failed to fetch student' },
            { status: 500 }
        );
    }
});

export const PUT = withStudentOrWarden(async (
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;

        // Security check: Only the student can update their own profile.
        const ownershipCheck = await pool.query(
            'SELECT 1 FROM students WHERE id = $1 AND user_id = $2',
            [id, request.user.id]
        );

        if (ownershipCheck.rowCount === 0) {
            return NextResponse.json(
                { error: 'Unauthorized: You can only update your own profile' },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Strict whitelist for allowed update fields
        const allowedFields: Record<string, string> = {
            'rollNumber': 'roll_number',
            'course': 'course',
            'year': 'year',
            'department': 'department',
            'roomNumber': 'room_number',
            'photo': 'photo'
        };

        const fields = Object.entries(body)
            .filter(([key]) => allowedFields[key])
            .map(([key, value], index) => ({
                col: allowedFields[key],
                val: value,
                index: index + 1
            }));

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
        }

        const setClause = fields.map(f => `${f.col} = $${f.index}`).join(', ');
        const values = fields.map(f => f.val);
        values.push(id);

        const query = `
            UPDATE students 
            SET ${setClause}, updated_at = NOW() 
            WHERE id = $${fields.length + 1} 
            RETURNING *
        `;

        const result = await pool.query(query, values);
        const updated = result.rows[0];

        if (!updated) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ ...updated, _id: updated.id });
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json(
            { error: 'Failed to update student' },
            { status: 500 }
        );
    }
});

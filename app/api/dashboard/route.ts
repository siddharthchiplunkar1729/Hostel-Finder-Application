import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withStudent } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withStudent(async (request: AuthenticatedRequest) => {
    try {
        // Force the studentId to be the authenticated user's student ID
        const studentLookupRes = await pool.query(
            'SELECT id FROM students WHERE user_id = $1',
            [request.user.id]
        );
        const studentId = studentLookupRes.rows[0]?.id;

        if (!studentId) {
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        // Parallel fetching for premium performance
        const [studentRes, complaintsRes, noticesRes, menuRes] = await Promise.all([
            // 1. Student Info
            pool.query(`
                SELECT s.*, u.name, u.email, hb.block_name 
                FROM students s 
                JOIN users u ON s.user_id = u.id 
                LEFT JOIN hostel_blocks hb ON s.hostel_block_id = hb.id 
                WHERE s.id = $1
            `, [studentId]),

            // 2. Recent Complaints
            pool.query(`
                SELECT id, title, status, created_at 
                FROM complaints 
                WHERE student_id = $1 
                ORDER BY created_at DESC 
                LIMIT 3
            `, [studentId]),

            // 3. Recent Notices
            pool.query(`
                SELECT n.*, hb.block_name 
                FROM notices n 
                LEFT JOIN hostel_blocks hb ON n.hostel_block_id = hb.id 
                ORDER BY n.created_at DESC 
                LIMIT 4
            `, []),

            // 4. Today's Mess Menu
            pool.query(`
                SELECT mm.* 
                FROM mess_menu mm 
                JOIN students s ON mm.hostel_block_id = s.hostel_block_id 
                WHERE s.id = $1 AND mm.day ILIKE $2
                LIMIT 1
            `, [studentId, new Date().toLocaleDateString('en-US', { weekday: 'long' })])
        ]);

        const student = studentRes.rows[0];

        // Map Student
        const mappedStudent = student ? {
            _id: student.id,
            name: student.name,
            rollNumber: student.roll_number,
            roomNumber: student.room_number,
            course: student.course,
            year: student.year,
            feeStatus: {
                isPaid: student.enrollment_status === 'Active',
                lastPayment: student.updated_at
            }
        } : null;

        // Map Complaints
        const mappedComplaints = complaintsRes.rows.map(c => ({
            _id: c.id,
            title: c.title,
            status: c.status,
            createdAt: c.created_at
        }));

        // Map Notices
        const mappedNotices = noticesRes.rows.map(n => ({
            _id: n.id,
            title: n.title,
            content: n.content,
            priority: n.priority,
            createdAt: n.created_at,
            hostelName: n.block_name
        }));

        // Map Menu
        const menu = menuRes.rows[0];
        const mappedMenu = menu ? {
            _id: menu.id,
            day: menu.day,
            meals: [
                { mealType: 'Breakfast', items: menu.breakfast?.split(',') || [], timings: '07:30 AM - 09:30 AM' },
                { mealType: 'Lunch', items: menu.lunch?.split(',') || [], timings: '12:30 PM - 02:30 PM' },
                { mealType: 'Snacks', items: menu.snacks?.split(',') || [], timings: '04:30 PM - 05:30 PM' },
                { mealType: 'Dinner', items: menu.dinner?.split(',') || [], timings: '07:30 PM - 09:30 PM' }
            ]
        } : null;

        return NextResponse.json({
            student: mappedStudent,
            complaints: mappedComplaints,
            notices: mappedNotices,
            messMenu: mappedMenu
        });

    } catch (error: any) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
});

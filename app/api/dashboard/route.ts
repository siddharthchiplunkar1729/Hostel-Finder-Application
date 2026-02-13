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
                SELECT s.*, u.name, u.email, u.can_access_dashboard, hb.block_name 
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
            enrollmentStatus: student.enrollment_status,
            canAccessDashboard: student.can_access_dashboard,
            feeStatus: {
                // If dashboard access has already been granted, treat enrollment as approved.
                isPaid: student.enrollment_status === 'Active' || student.can_access_dashboard === true,
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
            type: n.priority === 'Urgent' ? 'Emergency' : n.priority === 'High' ? 'Important' : 'General',
            from: {
                role: 'Administrative Officer',
                name: n.block_name || 'Hostel Hub System'
            },
            createdAt: n.created_at,
            hostelName: n.block_name
        }));

        // Map Menu
        const menu = menuRes.rows[0];
        const mappedMenu = menu ? {
            _id: menu.id,
            date: new Date().toISOString(),
            day: menu.day,
            specialMenu: false,
            meals: [
                {
                    mealType: 'Breakfast',
                    items: menu.breakfast?.split(',').map((i: string) => i.trim()).filter(Boolean) || [],
                    timings: '07:30 AM - 09:30 AM',
                    isVeg: true,
                    thumbsUp: menu.breakfast_up || 0,
                    thumbsDown: menu.breakfast_down || 0
                },
                {
                    mealType: 'Lunch',
                    items: menu.lunch?.split(',').map((i: string) => i.trim()).filter(Boolean) || [],
                    timings: '12:30 PM - 02:30 PM',
                    isVeg: true,
                    thumbsUp: menu.lunch_up || 0,
                    thumbsDown: menu.lunch_down || 0
                },
                {
                    mealType: 'Snacks',
                    items: menu.snacks?.split(',').map((i: string) => i.trim()).filter(Boolean) || [],
                    timings: '04:30 PM - 05:30 PM',
                    isVeg: true,
                    thumbsUp: menu.snacks_up || 0,
                    thumbsDown: menu.snacks_down || 0
                },
                {
                    mealType: 'Dinner',
                    items: menu.dinner?.split(',').map((i: string) => i.trim()).filter(Boolean) || [],
                    timings: '07:30 PM - 09:30 PM',
                    isVeg: true,
                    thumbsUp: menu.dinner_up || 0,
                    thumbsDown: menu.dinner_down || 0
                }
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

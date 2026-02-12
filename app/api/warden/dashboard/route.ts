import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withWarden } from '@/lib/middleware';

export const GET = withWarden(async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const blockId = searchParams.get('blockId');

        // Get hostel block stats
        const blockStatsRes = await pool.query(
            `SELECT COUNT(*) as total_blocks FROM hostel_blocks`
        );
        const totalBlocks = parseInt(blockStatsRes.rows[0]?.total_blocks || '0');

        // Get student stats
        const studentStatsQuery = blockId
            ? `SELECT COUNT(*) as count FROM students WHERE hostel_block_id = $1`
            : `SELECT COUNT(*) as count FROM students`;
        const studentStatsParams = blockId ? [blockId] : [];
        const studentStatsRes = await pool.query(studentStatsQuery, studentStatsParams);
        const studentsCount = parseInt(studentStatsRes.rows[0]?.count || '0');

        // Get application stats
        const appStatsQuery = blockId
            ? `SELECT status, COUNT(*) as count FROM hostel_applications WHERE hostel_block_id = $1 GROUP BY status`
            : `SELECT status, COUNT(*) as count FROM hostel_applications GROUP BY status`;
        const appStatsParams = blockId ? [blockId] : [];
        const appStatsRes = await pool.query(appStatsQuery, appStatsParams);

        let pendingApplications = 0;
        let acceptedApplications = 0;
        appStatsRes.rows.forEach(row => {
            if (row.status === 'Pending') pendingApplications = parseInt(row.count);
            if (row.status === 'Accepted') acceptedApplications = parseInt(row.count);
        });

        // Get occupancy stats for hostel blocks
        const occupancyQuery = blockId
            ? `SELECT id, block_name, type, total_rooms, occupied_rooms, available_rooms FROM hostel_blocks WHERE id = $1`
            : `SELECT id, block_name, type, total_rooms, occupied_rooms, available_rooms FROM hostel_blocks`;
        const occupancyParams = blockId ? [blockId] : [];
        const occupancyRes = await pool.query(occupancyQuery, occupancyParams);

        const occupancyStats = occupancyRes.rows.map(block => ({
            blockId: block.id,
            blockName: block.block_name,
            type: block.type,
            totalRooms: block.total_rooms,
            occupiedRooms: block.occupied_rooms,
            availableRooms: block.available_rooms,
            occupancyRate: ((block.occupied_rooms / block.total_rooms) * 100).toFixed(1)
        }));

        // Get recent applications with student info
        const applicationsQuery = blockId
            ? `SELECT 
                ha.id, ha.status, ha.application_data, ha.created_at, ha.hostel_block_id,
                s.id as student_id, s.roll_number, s.course, s.year, s.department,
                u.name, u.email, u.phone
               FROM hostel_applications ha
               JOIN students s ON ha.student_id = s.id
               JOIN users u ON s.user_id = u.id
               WHERE ha.hostel_block_id = $1
               ORDER BY ha.created_at DESC
               LIMIT 20`
            : `SELECT 
                ha.id, ha.status, ha.application_data, ha.created_at, ha.hostel_block_id,
                s.id as student_id, s.roll_number, s.course, s.year, s.department,
                u.name, u.email, u.phone
               FROM hostel_applications ha
               JOIN students s ON ha.student_id = s.id
               JOIN users u ON s.user_id = u.id
               ORDER BY ha.created_at DESC
               LIMIT 20`;
        const applicationsParams = blockId ? [blockId] : [];
        const applicationsRes = await pool.query(applicationsQuery, applicationsParams);

        const applications = applicationsRes.rows.map(row => ({
            _id: row.id,
            status: row.status,
            applicationData: row.application_data,
            createdAt: row.created_at,
            hostelBlockId: row.hostel_block_id,
            studentId: {
                _id: row.student_id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                rollNumber: row.roll_number,
                course: row.course,
                year: row.year,
                department: row.department,
                feeStatus: { isPaid: true } // Mock for now
            }
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalBlocks,
                totalStudents: studentsCount,
                studentsInBlock: blockId ? studentsCount : null,
                pendingApplications,
                acceptedApplications,
                complaints: {
                    pending: 0,
                    assigned: 0,
                    inProgress: 0,
                    resolvedToday: 0
                }
            },
            occupancy: occupancyStats,
            applications
        });

    } catch (error: any) {
        console.error('Error fetching warden dashboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data', details: error.message },
            { status: 500 }
        );
    }
});

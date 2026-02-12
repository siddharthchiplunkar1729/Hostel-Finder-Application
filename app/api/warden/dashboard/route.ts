import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withWarden } from '@/lib/middleware';
import { AuthenticatedRequest } from '@/types';

export const GET = withWarden(async (request: AuthenticatedRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const blockId = searchParams.get('blockId');

        const wardenId = request.user?.id;

        // Get the blocks this warden is responsible for
        const wardenBlocksRes = await pool.query(
            'SELECT id FROM hostel_blocks WHERE warden_user_id = $1',
            [wardenId]
        );
        const wardenBlockIds = wardenBlocksRes.rows.map(b => b.id);

        if (wardenBlockIds.length === 0 && request.user?.role !== 'Admin') {
            return NextResponse.json({
                success: true,
                stats: { totalBlocks: 0, totalStudents: 0, pendingApplications: 0, acceptedApplications: 0, complaints: { pending: 0, assigned: 0, inProgress: 0, resolvedToday: 0 } },
                occupancy: [],
                applications: []
            });
        }

        // Use selected blockId or all warden blocks
        const targetBlockIds = blockId ? [blockId] : wardenBlockIds;

        // Get hostel block stats
        const blockStatsRes = await pool.query(
            `SELECT COUNT(*) as total_blocks FROM hostel_blocks WHERE id = ANY($1)`,
            [wardenBlockIds]
        );
        const totalBlocks = parseInt(blockStatsRes.rows[0]?.total_blocks || '0');

        // Get student stats
        const studentStatsRes = await pool.query(
            `SELECT COUNT(*) as count FROM students WHERE hostel_block_id = ANY($1)`,
            [targetBlockIds]
        );
        const studentsCount = parseInt(studentStatsRes.rows[0]?.count || '0');

        // Get application stats
        const appStatsRes = await pool.query(
            `SELECT status, COUNT(*) as count FROM hostel_applications WHERE hostel_block_id = ANY($1) GROUP BY status`,
            [targetBlockIds]
        );

        let pendingApplications = 0;
        let acceptedApplications = 0;
        appStatsRes.rows.forEach(row => {
            if (row.status === 'Pending') pendingApplications = parseInt(row.count);
            if (row.status === 'Accepted') acceptedApplications = parseInt(row.count);
        });

        // Get occupancy stats for hostel blocks
        const occupancyRes = await pool.query(
            `SELECT id, block_name, type, total_rooms, occupied_rooms, available_rooms 
             FROM hostel_blocks 
             WHERE id = ANY($1)`,
            [wardenBlockIds]
        );

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
        const applicationsRes = await pool.query(
            `SELECT 
                ha.id, ha.status, ha.application_data, ha.created_at, ha.hostel_block_id,
                s.id as student_id, s.roll_number, s.course, s.year, s.department,
                u.name, u.email, u.phone
             FROM hostel_applications ha
             JOIN students s ON ha.student_id = s.id
             JOIN users u ON s.user_id = u.id
             WHERE ha.hostel_block_id = ANY($1)
             ORDER BY ha.created_at DESC
             LIMIT 20`,
            [targetBlockIds]
        );

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

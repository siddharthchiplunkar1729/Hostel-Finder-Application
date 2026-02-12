import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

import { withAdmin } from '@/lib/middleware';

export const GET = withAdmin(async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query = `
            SELECT hb.*, u.name as warden_name, u.email as warden_email 
            FROM hostel_blocks hb 
            LEFT JOIN users u ON hb.warden_user_id = u.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (status && status !== 'All') {
            // We'll add the approval_status check. Since we might not have the column, 
            // we'll use a fallback or ensure it's added.
            query += ` AND (hb.approval_status = $${paramIndex} OR ($${paramIndex} = 'Approved' AND hb.approval_status IS NULL))`;
            params.push(status);
            paramIndex++;
        }

        query += ' ORDER BY hb.created_at DESC';

        const result = await pool.query(query, params);

        return NextResponse.json(result.rows.map(r => ({
            _id: r.id,
            blockName: r.block_name,
            type: r.type,
            description: r.description,
            totalRooms: r.total_rooms,
            availableRooms: r.available_rooms,
            occupiedRooms: r.occupied_rooms,
            location: r.location,
            rating: parseFloat(r.rating || 0),
            approvalStatus: r.approval_status || 'Approved',
            wardenInfo: {
                name: r.warden_name || 'Unassigned',
                email: r.warden_email || 'n/a'
            }
        })));
    } catch (error: any) {
        console.error('Error fetching hostels for admin:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hostels' },
            { status: 500 }
        );
    }
});

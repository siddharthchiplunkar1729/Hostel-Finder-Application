import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');
        const types = searchParams.get('types')?.split(',');
        const facilities = searchParams.get('facilities')?.split(',');

        let query = `
            SELECT hb.*, u.name as warden_name, u.phone as warden_phone
            FROM hostel_blocks hb
            LEFT JOIN users u ON hb.warden_user_id = u.id
            WHERE (hb.approval_status = 'Approved' OR hb.approval_status IS NULL)
        `;
        const params: any[] = [];
        let paramIndex = 1;

        if (location) {
            query += ` AND hb.location ILIKE $${paramIndex}`;
            params.push(`%${location}%`);
            paramIndex++;
        }

        if (types && types.length > 0) {
            query += ` AND hb.type = ANY($${paramIndex})`;
            params.push(types);
            paramIndex++;
        }

        // For facilities, we need to handle array overlap or containment
        if (facilities && facilities.length > 0) {
            // Postgres array overlap: &&
            // query += ` AND hb.facilities && $${paramIndex}`;
            // OR containment: @>
            // Let's assume we want blocks that have ALL requested facilities
            // However, typical filter behavior is usually "contains any" or "contains all".
            // Let's use array overlap (&&) for broader results or containment (@>) for strict.
            // Using overlap (&&) is safer for general search.
            query += ` AND hb.facilities && $${paramIndex}`;
            params.push(facilities);
            paramIndex++;
        }

        query += ' ORDER BY hb.rating DESC';

        const res = await pool.query(query, params);

        const blocks = res.rows.map(row => ({
            _id: row.id,
            blockName: row.block_name,
            type: row.type,
            description: row.description,
            totalRooms: row.total_rooms,
            availableRooms: row.available_rooms,
            occupiedRooms: row.occupied_rooms,
            location: row.location,
            rating: parseFloat(row.rating),
            virtualTourUrl: row.virtual_tour_url,
            images: row.images || [],
            facilities: row.facilities || [],
            wardenInfo: {
                name: row.warden_name || 'Assigned Warden',
                phone: row.warden_phone || 'N/A'
            }
        }));

        return NextResponse.json(blocks);
    } catch (error: any) {
        console.error('Error fetching hostel blocks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hostel blocks', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic insert for seeding/admin (simplified)
        // Expects camelCase body, maps to snake_case columns
        const { blockName, type, description, totalRooms, availableRooms, location, images, facilities, wardenId } = body;

        const res = await pool.query(
            `INSERT INTO hostel_blocks 
            (block_name, type, description, total_rooms, available_rooms, location, images, facilities, warden_user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [blockName, type, description, totalRooms, availableRooms, location, images, facilities, wardenId]
        );

        const row = res.rows[0];
        const block = {
            _id: row.id,
            blockName: row.block_name,
            type: row.type,
            // ... map other fields if needed, but POST response usually just needs confirmation or ID
            ...row
        };

        return NextResponse.json(block, { status: 201 });
    } catch (error: any) {
        console.error('Error creating hostel block:', error);
        return NextResponse.json(
            { error: 'Failed to create hostel block', details: error.message },
            { status: 500 }
        );
    }
}

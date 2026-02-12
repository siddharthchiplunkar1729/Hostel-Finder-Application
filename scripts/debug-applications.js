const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function debug() {
    try {
        const wardens = await pool.query(`
            SELECT u.email, u.name, hb.block_name, hb.id as block_id
            FROM users u
            LEFT JOIN hostel_blocks hb ON hb.warden_user_id = u.id
            WHERE u.role IN ('Warden', 'Admin')
        `);

        const apps = await pool.query(`
            SELECT ha.id, ha.status, ha.created_at, hb.block_name, u.name as student_name, hb.id as block_id
            FROM hostel_applications ha
            JOIN hostel_blocks hb ON ha.hostel_block_id = hb.id
            JOIN students s ON ha.student_id = s.id
            JOIN users u ON s.user_id = u.id
            ORDER BY ha.created_at DESC
            LIMIT 20
        `);

        console.log(JSON.stringify({
            wardens: wardens.rows,
            applications: apps.rows
        }, null, 2));

        await pool.end();
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        process.exit(1);
    }
}

debug();

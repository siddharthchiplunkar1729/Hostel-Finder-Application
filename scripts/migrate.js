const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('🚀 Running migrations...');
        await client.query('ALTER TABLE hostel_blocks ADD COLUMN IF NOT EXISTS approval_status TEXT CHECK (approval_status IN (\'Pending\', \'Approved\', \'Rejected\')) DEFAULT \'Approved\'');
        console.log('✅ Column approval_status added successfully');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();

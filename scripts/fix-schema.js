const { Pool } = require('pg');
require('dotenv').config();

async function fixSchema() {
    console.log('Connecting to:', process.env.DATABASE_URL);
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();
    try {
        console.log('Adding is_active column to users table...');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;');
        console.log('Success!');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

fixSchema();

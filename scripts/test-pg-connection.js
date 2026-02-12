const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        console.log("Attempting to connect to PostgreSQL at:", process.env.DATABASE_URL);
        const res = await pool.query('SELECT NOW()');
        console.log("✅ Successfully connected to PostgreSQL!");
        console.log("Server time:", res.rows[0].now);
        await pool.end();
    } catch (error) {
        console.error("❌ Connection failed!");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        process.exit(1);
    }
}

testConnection();

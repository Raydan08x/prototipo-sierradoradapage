const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'SDDB',
    password: process.env.DB_PASSWORD || '199611Cm.',
    port: process.env.DB_PORT || 5432,
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    visit_date DATE NOT NULL,
    group_size INTEGER NOT NULL CHECK (group_size >= 4 AND group_size <= 20),
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

(async () => {
    try {
        const client = await pool.connect();
        await client.query(createTableQuery);
        console.log('Reservations table created successfully.');
        client.release();
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await pool.end();
    }
})();

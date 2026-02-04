import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'SDDB',
    password: process.env.DB_PASSWORD || '199611Cm.',
    port: parseInt(process.env.DB_PORT || '5432'),
});

const createReservationsTable = `
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  visit_date DATE NOT NULL,
  group_size INTEGER NOT NULL CHECK (group_size >= 4 AND group_size <= 20),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const setup = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        await client.query(createReservationsTable);
        console.log('Reservations table created or already exists.');

        client.release();
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

setup();

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SDDB',
    password: process.env.DB_PASSWORD || '199611Cm.',
    port: 5432,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default {
    query: (text, params) => pool.query(text, params),
};

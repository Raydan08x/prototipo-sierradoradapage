import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const poolConfig = {
    user: process.env.DB_USER || 'sierra_admin',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'sddb',
    password: process.env.DB_PASSWORD || '199611Cm.',
    port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(poolConfig);

const connectWithRetry = async () => {
    let retries = 5;
    while (retries) {
        try {
            const client = await pool.connect();
            console.log('Successfully connected to PostgreSQL at', poolConfig.host);
            client.release();
            break;
        } catch (err) {
            console.error('Database connection failed, retrying...', retries, 'attempts left');
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    if (retries === 0) {
        console.error('Could not connect to database after several attempts');
        process.exit(-1);
    }
};

connectWithRetry();

export default {
    query: (text, params) => pool.query(text, params),
    pool: pool
};

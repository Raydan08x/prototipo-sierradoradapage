import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Sierra Dorada API Running', database: 'SDDB' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

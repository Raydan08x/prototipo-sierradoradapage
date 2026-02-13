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

// Serve static files (logo, etc.)
app.use('/public', express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Base route - Visual Status Page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sierra Dorada API | Estado del Sistema</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #0F172A;
                color: #E2E8F0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                text-align: center;
                background: #1E293B;
                padding: 3rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                border: 1px solid #334155;
            }
            .logo {
                width: 150px;
                height: auto;
                margin-bottom: 2rem;
            }
            h1 {
                font-size: 2.5rem;
                color: #fbbf24;
                margin: 0 0 1rem 0;
            }
            .status {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: #064e3b;
                color: #34d399;
                padding: 0.5rem 1rem;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 1.1rem;
                border: 1px solid #059669;
            }
            .status-dot {
                width: 10px;
                height: 10px;
                background-color: #34d399;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
                100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
            }
            .info {
                margin-top: 2rem;
                color: #94a3b8;
            }
            a { color: #fbbf24; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="/public/assets/isotipo.png" alt="Sierra Dorada Logo" class="logo">
            <h1>Sierra Dorada API</h1>
            <div class="status">
                <div class="status-dot"></div>
                Sistema Operativo
            </div>
            <div class="info">
                <p>Base de Datos: <strong>Conectada (SDDB)</strong></p>
                <p>Versión: <strong>1.0.0 (Robust)</strong></p>
                <p>Acceso Web: <a href="http://192.168.1.13:8881">Ir al Sitio Principal</a></p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

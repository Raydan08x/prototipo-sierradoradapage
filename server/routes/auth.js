import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Helper: Send Verification Email
const sendVerificationEmail = async (email, code) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log(`[MOCK EMAIL] To: ${email} | Code: ${code}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: '"Sierra Dorada" <noreply@sierradorada.co>',
            to: email,
            subject: 'Verifica tu cuenta - Sierra Dorada',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #B3A269;">Bienvenido a Sierra Dorada</h2>
                    <p>Tu código de verificación es:</p>
                    <h1 style="background: #222223; color: #B3A269; padding: 10px; text-align: center; letter-spacing: 5px;">${code}</h1>
                    <p>Este código expira en 15 minutos.</p>
                </div>
            `
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback to console for dev
        console.log(`[FALLBACK EMAIL] To: ${email} | Code: ${code}`);
    }
};

// REGISTER
router.post('/signup', async (req, res) => {
    const { email, password, full_name, phone, terms_accepted, data_processing_consent } = req.body;

    try {
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        const userResult = await db.query(
            'INSERT INTO users (email, password_hash, verification_code, code_expires_at, is_verified) VALUES ($1, $2, $3, $4, FALSE) RETURNING id, email, role',
            [email, hashedPassword, verificationCode, codeExpiresAt]
        );
        const newUser = userResult.rows[0];

        await db.query(
            'INSERT INTO profiles (id, full_name, phone, terms_accepted, data_processing_consent, terms_accepted_at) VALUES ($1, $2, $3, $4, $5, NOW())',
            [newUser.id, full_name, phone, terms_accepted, data_processing_consent]
        );

        // Send Email
        await sendVerificationEmail(email, verificationCode);

        res.json({ message: 'Usuario registrado. Por favor verifica tu correo.', userId: newUser.id, email: newUser.email });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// VERIFY EMAIL
router.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

        const user = result.rows[0];

        if (user.is_verified) return res.status(400).json({ error: 'Usuario ya verificado' });
        if (user.verification_code !== code) return res.status(400).json({ error: 'Código inválido' });
        if (new Date() > new Date(user.code_expires_at)) return res.status(400).json({ error: 'El código ha expirado' });

        await db.query('UPDATE users SET is_verified = TRUE, verification_code = NULL, code_expires_at = NULL WHERE id = $1', [user.id]);

        // Generate Token immediately after verification
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Correo verificado exitosamente', token, user: { id: user.id, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// RESEND CODE
router.post('/resend-code', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await db.query('UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE id = $3', [verificationCode, codeExpiresAt, result.rows[0].id]);

        await sendVerificationEmail(email, verificationCode);

        res.json({ message: 'Código reenviado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// GOOGLE LOGIN
router.post('/google-login', async (req, res) => {
    const { credential } = req.body;

    try {
        // Verify Google Token if Client ID is present
        let payload;
        if (GOOGLE_CLIENT_ID) {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } else {
            // Mock verification for dev without credentials (decode only)
            payload = jwt.decode(credential);
        }

        const { email, name, sub: googleId, picture } = payload;

        // Check if user exists
        let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = userResult.rows[0];

        if (!user) {
            // Create new verified user
            const result = await db.query(
                'INSERT INTO users (email, password_hash, is_verified, google_id) VALUES ($1, $2, TRUE, $3) RETURNING id, email, role',
                [email, 'GOOGLE_AUTH', googleId]
            );
            user = result.rows[0];

            await db.query(
                'INSERT INTO profiles (id, full_name, terms_accepted, data_processing_consent, terms_accepted_at) VALUES ($1, $2, TRUE, TRUE, NOW())',
                [user.id, name]
            );
        } else {
            // Link Google ID if not linked
            if (!user.google_id) {
                await db.query('UPDATE users SET google_id = $1, is_verified = TRUE WHERE id = $2', [googleId, user.id]);
            }
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        // Get Profile
        const profileResult = await db.query('SELECT * FROM profiles WHERE id = $1', [user.id]);
        const profile = profileResult.rows[0] || {};

        res.json({
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                ...profile
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ error: 'Error autenticando con Google' });
    }
});

// LOGIN (Legacy + Verified Check)
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Credenciales inválidas' });

        const user = result.rows[0];

        // Ensure verified (optional, depending on strictness)
        // if (!user.is_verified) return res.status(403).json({ error: 'Por favor verifica tu correo primero', isNotVerified: true });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        const isLegacyMatch = user.password_hash === password;

        if (!isMatch && !isLegacyMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

        const profileResult = await db.query('SELECT * FROM profiles WHERE id = $1', [user.id]);
        const profile = profileResult.rows[0] || {};

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                ...profile
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// GET USER (ME)
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userRes = await db.query('SELECT id, email, role, is_verified FROM users WHERE id = $1', [decoded.id]);
        const profileRes = await db.query('SELECT * FROM profiles WHERE id = $1', [decoded.id]);

        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json({
            user: {
                ...userRes.rows[0],
                ...profileRes.rows[0]
            }
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;

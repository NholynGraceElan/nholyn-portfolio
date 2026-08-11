import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { bootstrapEnv, getEnv, SERVER_ROOT, CREDENTIALS_PATH, ENV_PATH } from './env.js';
import { keyFromHex, encryptJson, decryptJson, sha256 } from './security.js';
import { appendMessage, readMessages, deleteMessage } from './store.js';

bootstrapEnv();
dotenv.config({ path: ENV_PATH });

const app = express();
const PORT = Number(getEnv('PORT', '4000'));
const CLIENT_ORIGIN = getEnv('CLIENT_ORIGIN', 'http://localhost:5173');
const ENCRYPTION_KEY = keyFromHex(sha256(getEnv('ENCRYPTION_KEY', crypto.randomBytes(32).toString('hex'))));
const JWT_SECRET = getEnv('JWT_SECRET');
const ADMIN_USERNAME = getEnv('ADMIN_USERNAME', 'nholyn');
const ADMIN_PASSWORD_HASH = getEnv('ADMIN_PASSWORD_HASH');
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            connectSrc: ["'self'"],
            scriptSrc: ["'self'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [CLIENT_ORIGIN],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
  })
);

app.use(express.json({ limit: '32kb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please wait a few minutes and try again.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

function requireAdmin(req, res, next) {
  const token = req.cookiesToken || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin' || !payload.session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.admin = { username: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function readCookie(req) {
  const raw = req.headers.cookie || '';
  const match = raw.match(/(?:^|;\s*)np_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

app.use('/api', (req, res, next) => {
  req.cookiesToken = readCookie(req);
  next();
});

app.get('/api/health', apiLimiter, (req, res) => {
  res.json({ ok: true, service: 'nholyn-portfolio', time: new Date().toISOString() });
});

app.post(
  '/api/contact',
  contactLimiter,
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters.'),
  body('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Please enter a valid email address.'),
  body('subject').trim().isLength({ max: 120 }).optional({ values: 'falsy' }).withMessage('Subject is too long.'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters.'),
  body('website').custom((value) => value === undefined || value === '').withMessage(''),
  (req, res) => {
    const errors = validationResult(req);
    if (req.body.website) {
      return res.status(200).json({ ok: true });
    }
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array()[0].msg });
    }
    const { name, email, subject = '', message } = req.body;
    const entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      fingerprint: sha256(`${email.toLowerCase()}|${req.ip}`).slice(0, 16),
      encrypted: encryptJson(
        {
          name,
          email,
          subject,
          message,
        },
        ENCRYPTION_KEY
      ),
    };
    appendMessage(entry);
    res.status(201).json({ ok: true, message: 'Message received. Encrypted and stored safely.' });
  }
);

app.post(
  '/api/admin/login',
  loginLimiter,
  body('username').trim().isLength({ min: 1, max: 60 }),
  body('password').isLength({ min: 1, max: 200 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ error: 'Invalid credentials.' });
    const { username, password } = req.body;
    const userOk =
      username === ADMIN_USERNAME &&
      bcrypt.compareSync(password, ADMIN_PASSWORD_HASH || '$2b$12$invalid.invalid.invalid.invalid.invalid.invalid');
    if (!userOk) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ role: 'admin', session: crypto.randomUUID(), sub: username }, JWT_SECRET, {
      expiresIn: '12h',
    });
    res.cookie('np_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 12 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({ ok: true });
  }
);

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('np_token', { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const messages = readMessages()
    .map((m) => {
      try {
        return { id: m.id, createdAt: m.createdAt, decrypted: decryptJson(m.encrypted, ENCRYPTION_KEY) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ messages });
});

app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const removed = deleteMessage(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Message not found.' });
  res.json({ ok: true });
});

app.get('/api/admin/status', requireAdmin, (req, res) => {
  res.json({ ok: true, admin: req.admin.username });
});

const clientDist = path.join(SERVER_ROOT, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  console.log(`[static] Serving production build from ${clientDist}`);
}

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`[server] Nholyn Portfolio API listening on http://localhost:${PORT}`);
  console.log(`[server] Allowed origin: ${CLIENT_ORIGIN}`);
});

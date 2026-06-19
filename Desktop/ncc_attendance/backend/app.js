require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const cadetRoutes = require('./routes/cadets');
const { connectDb } = require('./services/db');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

if (!isProduction) {
  allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173', 'https://ncc-attendance.nccvardhaman.workers.dev');
}

function hasUnsafeMongoKey(value) {
  if (!value || typeof value !== 'object') return false;

  return Object.entries(value).some(([key, child]) => {
    if (key.startsWith('$') || key.includes('.')) return true;
    if (Array.isArray(child)) return child.some(hasUnsafeMongoKey);
    return hasUnsafeMongoKey(child);
  });
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include health checks and server-to-server calls.
    const cleanOrigin = origin ? origin.replace(/\/+$/, '') : '';
    if (!origin || allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.pages.dev')) {
      return callback(null, true);
    }

    const error = new Error('This origin is not allowed to access the NCC Attendance API');
    error.status = 403;
    return callback(error);
  }
}));
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  if (hasUnsafeMongoKey(req.body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  next();
});

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' }
}));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' }
}));

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/cadets', cadetRoutes);

app.get('/', (req, res) => {
  res.send({ status: 'NCC Attendance API', version: '1.0.0' });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  const duplicateKey = err.code === 11000;
  const message = duplicateKey
    ? 'A record with these details already exists'
    : status >= 500 && isProduction
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(duplicateKey ? 409 : status).json({ error: message });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`NCC Attendance backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

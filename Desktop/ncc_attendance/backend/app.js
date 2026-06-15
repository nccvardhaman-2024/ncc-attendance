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
  allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173');
}

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include health checks and server-to-server calls.
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  }
}));
app.use(express.json({ limit: '100kb' }));

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
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
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

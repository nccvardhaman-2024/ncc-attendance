const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const cadetRoutes = require('./routes/cadets');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/cadets', cadetRoutes);

app.get('/', (req, res) => {
  res.send({ status: 'NCC Attendance API', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`NCC Attendance backend running on port ${PORT}`);
});

const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();
const REGIMENTAL_PATTERN = /^[A-Z0-9/-]{4,32}$/;

function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

function normalizeRegimentalNumber(value) {
  return String(value || '').trim().toUpperCase();
}

function cleanText(value, maxLength) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function validateCadetInput(body, requirePassword) {
  const regimentalNumber = normalizeRegimentalNumber(body.regimentalNumber);
  const name = cleanText(body.name, 80);
  const unit = cleanText(body.unit, 80);
  const rank = cleanText(body.rank, 80) || 'Cadet';
  const password = String(body.password || '');

  const allowedRanks = ['Cadet', 'Lance Corporal', 'Corporal', 'Sergeant', 'Cadet Under Officer', 'Cadet Senior Under Officer'];

  if (!regimentalNumber || !name || !unit || (requirePassword && !password)) {
    return { error: 'All cadet details are required' };
  }
  if (rank && !allowedRanks.includes(rank)) {
    return { error: 'Invalid cadet rank selected' };
  }
  if (!REGIMENTAL_PATTERN.test(regimentalNumber)) {
    return { error: 'Regimental number must be 4-32 characters and contain only letters, numbers, /, or -' };
  }
  if (password && password.length < 8) {
    return { error: requirePassword ? 'Cadet password must be at least 8 characters' : 'New password must be at least 8 characters' };
  }
  if (password && password.length > 128) {
    return { error: 'Password cannot exceed 128 characters' };
  }

  return { value: { regimentalNumber, name, unit, rank, password } };
}

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/', async (req, res) => {
  const users = await User.find({ role: 'cadet' }).lean();
  const attendance = await Attendance.find({}).lean();
  const today = new Date().toISOString().slice(0, 10);

  const cadets = users.map(({ regimentalNumber, name, unit, rank }) => {
    const records = attendance.filter((record) => record.regimentalNumber === regimentalNumber);
    const present = records.filter((record) => record.status === 'Present').length;
    const absent = records.filter((record) => record.status === 'Absent').length;
    const late = records.filter((record) => record.status === 'Late').length;
    const total = records.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    const todayRecord = records.find((record) => record.date === today);
    return {
      regimentalNumber,
      name,
      unit,
      rank: rank || 'Cadet',
      totals: { present, absent, late, total, percentage },
      todayStatus: todayRecord ? todayRecord.status : 'Not recorded'
    };
  });

  res.json({ cadets });
});

router.post('/', async (req, res) => {
  const parsed = validateCadetInput(req.body, true);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const { regimentalNumber, name, unit, rank, password } = parsed.value;
  const existing = await User.findOne({ regimentalNumber });
  if (existing) {
    return res.status(409).json({ error: 'Regimental number already exists' });
  }

  const cadet = await User.create({
    regimentalNumber,
    name,
    unit,
    rank,
    role: 'cadet',
    passwordHash: hashPassword(password)
  });

  res.status(201).json({ cadet: { regimentalNumber: cadet.regimentalNumber, name: cadet.name, unit: cadet.unit, rank: cadet.rank }, message: 'Cadet added successfully' });
});

router.put('/:regimentalNumber', async (req, res) => {
  const originalRegimentalNumber = normalizeRegimentalNumber(req.params.regimentalNumber);
  const parsed = validateCadetInput(req.body, false);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const { regimentalNumber, name, unit, rank, password } = parsed.value;
  const cadet = await User.findOne({ regimentalNumber: originalRegimentalNumber, role: 'cadet' });
  if (!cadet) {
    return res.status(404).json({ error: 'Cadet not found' });
  }

  const duplicate = await User.findOne({
    regimentalNumber,
    role: 'cadet',
    _id: { $ne: cadet._id }
  });
  if (duplicate) {
    return res.status(409).json({ error: 'New regimental number already exists' });
  }

  cadet.regimentalNumber = regimentalNumber;
  cadet.name = name;
  cadet.unit = unit;
  cadet.rank = rank;
  if (password) {
    cadet.passwordHash = hashPassword(password);
  }

  await cadet.save();
  await Attendance.updateMany(
    { regimentalNumber: originalRegimentalNumber },
    { $set: { regimentalNumber, cadetName: name } }
  );

  res.json({ cadet: { regimentalNumber, name, unit, rank }, message: 'Cadet updated successfully' });
});

module.exports = router;

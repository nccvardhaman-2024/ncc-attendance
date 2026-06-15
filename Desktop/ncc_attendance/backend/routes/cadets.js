const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();

function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/', async (req, res) => {
  const users = await User.find({ role: 'cadet' }).lean();
  const attendance = await Attendance.find({}).lean();
  const today = new Date().toISOString().slice(0, 10);

  const cadets = users
    .map(({ regimentalNumber, name, unit }) => {
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
        totals: { present, absent, late, total, percentage },
        todayStatus: todayRecord ? todayRecord.status : 'Not recorded'
      };
    });

  res.json({ cadets });
});

router.post('/', async (req, res) => {
  const regimentalNumber = String(req.body.regimentalNumber || '').trim();
  const name = String(req.body.name || '').trim();
  const unit = String(req.body.unit || '').trim();
  const password = String(req.body.password || '');

  if (!regimentalNumber || !name || !unit || !password) {
    return res.status(400).json({ error: 'All cadet details are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Cadet password must be at least 8 characters' });
  }

  const existing = await User.findOne({ regimentalNumber });
  if (existing) {
    return res.status(409).json({ error: 'Regimental number already exists' });
  }

  const cadet = await User.create({
    regimentalNumber,
    name,
    unit,
    role: 'cadet',
    passwordHash: hashPassword(password)
  });

  res.status(201).json({ cadet: { regimentalNumber: cadet.regimentalNumber, name: cadet.name, unit: cadet.unit } });
});

router.put('/:regimentalNumber', async (req, res) => {
  const originalRegimentalNumber = req.params.regimentalNumber;
  const regimentalNumber = String(req.body.regimentalNumber || '').trim();
  const name = String(req.body.name || '').trim();
  const unit = String(req.body.unit || '').trim();
  const password = String(req.body.password || '');

  if (!regimentalNumber || !name || !unit) {
    return res.status(400).json({ error: 'Regimental number, name, and unit are required' });
  }
  if (password && password.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const cadet = await User.findOne({ regimentalNumber: originalRegimentalNumber, role: 'cadet' });
  if (!cadet) {
    return res.status(404).json({ error: 'Cadet not found' });
  }

  const duplicate = await User.findOne({
    regimentalNumber: { $eq: regimentalNumber, $ne: originalRegimentalNumber },
    role: 'cadet',
  });
  if (duplicate) {
    return res.status(409).json({ error: 'New regimental number already exists' });
  }

  cadet.regimentalNumber = regimentalNumber;
  cadet.name = name;
  cadet.unit = unit;
  if (password) {
    cadet.passwordHash = hashPassword(password);
  }

  await cadet.save();
  await Attendance.updateMany(
    { regimentalNumber: originalRegimentalNumber },
    { $set: { regimentalNumber, cadetName: name } }
  );

  res.json({ cadet: { regimentalNumber, name, unit } });
});

module.exports = router;

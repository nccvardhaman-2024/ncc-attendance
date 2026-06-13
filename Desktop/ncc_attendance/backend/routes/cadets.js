const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { getAttendance, getUsers, saveUsers } = require('../services/dataStore');
const crypto = require('crypto');

const router = express.Router();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/', (req, res) => {
  const users = getUsers();
  const attendance = getAttendance();
  const today = new Date().toISOString().slice(0, 10);

  const cadets = users
    .filter((user) => user.role === 'cadet')
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

router.post('/', (req, res) => {
  const { regimentalNumber, name, unit, password } = req.body;
  if (!regimentalNumber || !name || !unit || !password) {
    return res.status(400).json({ error: 'All cadet details are required' });
  }

  const users = getUsers();
  const existing = users.find((item) => item.regimentalNumber === regimentalNumber);
  if (existing) {
    return res.status(409).json({ error: 'Regimental number already exists' });
  }

  const cadet = {
    regimentalNumber,
    name,
    unit,
    role: 'cadet',
    passwordHash: hashPassword(password)
  };

  users.push(cadet);
  saveUsers(users);

  res.status(201).json({ cadet: { regimentalNumber, name, unit } });
});

router.put('/:regimentalNumber', (req, res) => {
  const originalRegimentalNumber = req.params.regimentalNumber;
  const { regimentalNumber, name, unit, password } = req.body;
  if (!regimentalNumber || !name || !unit) {
    return res.status(400).json({ error: 'Regimental number, name, and unit are required' });
  }

  const users = getUsers();
  const cadetIndex = users.findIndex((item) => item.regimentalNumber === originalRegimentalNumber && item.role === 'cadet');
  if (cadetIndex < 0) {
    return res.status(404).json({ error: 'Cadet not found' });
  }

  const duplicate = users.find((item) => item.regimentalNumber === regimentalNumber && item.role === 'cadet' && item.regimentalNumber !== originalRegimentalNumber);
  if (duplicate) {
    return res.status(409).json({ error: 'New regimental number already exists' });
  }

  const attendance = getAttendance();
  const oldCadet = users[cadetIndex];
  const updatedCadet = {
    ...oldCadet,
    regimentalNumber,
    name,
    unit,
    passwordHash: password ? hashPassword(password) : oldCadet.passwordHash
  };

  users[cadetIndex] = updatedCadet;

  const updatedAttendance = attendance.map((record) => {
    if (record.regimentalNumber === originalRegimentalNumber) {
      return {
        ...record,
        regimentalNumber,
        cadetName: name
      };
    }
    return record;
  });

  saveUsers(users);
  saveAttendance(updatedAttendance);

  res.json({ cadet: { regimentalNumber, name, unit } });
});

module.exports = router;

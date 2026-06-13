const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { getAttendance, getUsers, saveAttendance } = require('../services/dataStore');
const router = express.Router();

router.use(authenticate);

router.get('/mine', (req, res) => {
  const attendance = getAttendance();
  const mine = attendance.filter((record) => record.regimentalNumber === req.user.regimentalNumber);
  res.json({ attendance: mine });
});

router.get('/all', authorizeAdmin, (req, res) => {
  const { date } = req.query;
  let attendance = getAttendance();

  if (date) {
    attendance = attendance.filter((record) => record.date === date);
  }

  res.json({ attendance });
});

router.get('/dates', authorizeAdmin, (req, res) => {
  const attendance = getAttendance();
  const dates = Array.from(new Set(attendance.map((record) => record.date))).sort((a, b) => b.localeCompare(a));
  res.json({ dates });
});

router.post('/', authorizeAdmin, (req, res) => {
  const { regimentalNumber, date, status, note } = req.body;
  if (!regimentalNumber || !date || !status) {
    return res.status(400).json({ error: 'Regimental number, date, and status are required' });
  }

  const users = getUsers();
  const cadet = users.find((item) => item.regimentalNumber === regimentalNumber && item.role === 'cadet');
  if (!cadet) {
    return res.status(404).json({ error: 'Cadet not found' });
  }

  const attendance = getAttendance();
  const existingIndex = attendance.findIndex((record) => record.regimentalNumber === regimentalNumber && record.date === date);
  const newRecord = {
    id: existingIndex >= 0 ? attendance[existingIndex].id : attendance.length + 1,
    regimentalNumber,
    cadetName: cadet.name,
    date,
    status,
    note: note || '',
    recordedBy: req.user.regimentalNumber,
    recordedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    attendance[existingIndex] = newRecord;
  } else {
    attendance.push(newRecord);
  }

  saveAttendance(attendance);
  res.status(201).json({ attendance: newRecord });
});

router.post('/batch', authorizeAdmin, (req, res) => {
  const items = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Array of attendance entries required' });
  }

  const users = getUsers();
  const attendance = getAttendance();
  const updated = [];

  items.forEach((item) => {
    const { regimentalNumber, date, status, note } = item;
    if (!regimentalNumber || !date || !status) {
      return;
    }

    const cadet = users.find((user) => user.regimentalNumber === regimentalNumber && user.role === 'cadet');
    if (!cadet) {
      return;
    }

    const existingIndex = attendance.findIndex((record) => record.regimentalNumber === regimentalNumber && record.date === date);
    const record = {
      id: existingIndex >= 0 ? attendance[existingIndex].id : attendance.length + 1,
      regimentalNumber,
      cadetName: cadet.name,
      date,
      status,
      note: note || '',
      recordedBy: req.user.regimentalNumber,
      recordedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      attendance[existingIndex] = record;
    } else {
      attendance.push(record);
    }

    updated.push(record);
  });

  saveAttendance(attendance);
  res.status(201).json({ updated, count: updated.length });
});

router.get('/analytics', authorizeAdmin, (req, res) => {
  const attendance = getAttendance();
  const users = getUsers();
  const cadets = users.filter((user) => user.role === 'cadet');
  const today = new Date().toISOString().slice(0, 10);

  // per-cadet summary (with percentage)
  const summary = cadets.map((cadet) => {
    const records = attendance.filter((record) => record.regimentalNumber === cadet.regimentalNumber);
    const present = records.filter((record) => record.status === 'Present').length;
    const absent = records.filter((record) => record.status === 'Absent').length;
    const late = records.filter((record) => record.status === 'Late').length;
    const total = records.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return {
      regimentalNumber: cadet.regimentalNumber,
      name: cadet.name,
      unit: cadet.unit,
      totals: { present, absent, late, total, percentage }
    };
  });

  // daily totals (today)
  const dailyRecords = attendance.filter((record) => record.date === today);
  const dailyTotals = {
    present: dailyRecords.filter((record) => record.status === 'Present').length,
    absent: dailyRecords.filter((record) => record.status === 'Absent').length,
    late: dailyRecords.filter((record) => record.status === 'Late').length,
    totalRecords: dailyRecords.length,
    date: today,
    percentage: dailyRecords.length > 0 ? Math.round((dailyRecords.filter((record) => record.status === 'Present').length / dailyRecords.length) * 100) : 0
  };

  // daily grouping by gender and batch for quick front-end use
  const dailyByGender = { SD: { present: 0, absent: 0, late: 0, total: 0 }, SW: { present: 0, absent: 0, late: 0, total: 0 }, UNKNOWN: { present: 0, absent: 0, late: 0, total: 0 } };
  const dailyByBatch = {};
  dailyRecords.forEach((rec) => {
    const rn = rec.regimentalNumber || '';
    const genderMatch = rn.match(/(SD|SW)/i);
    const gender = genderMatch ? genderMatch[0].toUpperCase() : 'UNKNOWN';
    const batchMatch = rn.match(/(20\d{2})/);
    const batch = batchMatch ? batchMatch[0] : 'unknown';

    if (!dailyByBatch[batch]) dailyByBatch[batch] = { present: 0, absent: 0, late: 0, total: 0 };
    dailyByBatch[batch].total += 1;
    dailyByGender[gender] = dailyByGender[gender] || { present: 0, absent: 0, late: 0, total: 0 };
    dailyByGender[gender].total += 1;

    if (rec.status === 'Present') {
      dailyByBatch[batch].present += 1;
      dailyByGender[gender].present += 1;
    } else if (rec.status === 'Absent') {
      dailyByBatch[batch].absent += 1;
      dailyByGender[gender].absent += 1;
    } else if (rec.status === 'Late') {
      dailyByBatch[batch].late += 1;
      dailyByGender[gender].late += 1;
    }
  });

  Object.keys(dailyByBatch).forEach((b) => {
    const g = dailyByBatch[b];
    g.percentage = g.total > 0 ? Math.round((g.present / g.total) * 100) : 0;
  });
  Object.keys(dailyByGender).forEach((gk) => {
    const g = dailyByGender[gk];
    g.percentage = g.total > 0 ? Math.round((g.present / g.total) * 100) : 0;
  });

  // overall totals
  const totals = {
    present: attendance.filter((record) => record.status === 'Present').length,
    absent: attendance.filter((record) => record.status === 'Absent').length,
    late: attendance.filter((record) => record.status === 'Late').length,
    totalRecords: attendance.length,
    percentage: attendance.length > 0 ? Math.round((attendance.filter((record) => record.status === 'Present').length / attendance.length) * 100) : 0
  };

  // group by gender code SD/SW and by batch year extracted from regimental number
  const byGender = { SD: { present: 0, absent: 0, late: 0, total: 0 }, SW: { present: 0, absent: 0, late: 0, total: 0 }, UNKNOWN: { present: 0, absent: 0, late: 0, total: 0 } };
  const byBatch = {}; // { '2024': { present, absent, late, total }, ... }

  attendance.forEach((rec) => {
    const rn = rec.regimentalNumber || '';
    const genderMatch = rn.match(/(SD|SW)/i);
    const gender = genderMatch ? genderMatch[0].toUpperCase() : 'UNKNOWN';
    const batchMatch = rn.match(/(20\d{2})/); // year like 2024
    const batch = batchMatch ? batchMatch[0] : 'unknown';

    if (!byBatch[batch]) byBatch[batch] = { present: 0, absent: 0, late: 0, total: 0 };

    byBatch[batch].total += 1;
    byGender[gender] = byGender[gender] || { present: 0, absent: 0, late: 0, total: 0 };
    byGender[gender].total += 1;

    if (rec.status === 'Present') {
      byBatch[batch].present += 1;
      byGender[gender].present += 1;
    } else if (rec.status === 'Absent') {
      byBatch[batch].absent += 1;
      byGender[gender].absent += 1;
    } else if (rec.status === 'Late') {
      byBatch[batch].late += 1;
      byGender[gender].late += 1;
    }
  });

  // attach percentage values to groups
  Object.keys(byBatch).forEach((b) => {
    const g = byBatch[b];
    g.percentage = g.total > 0 ? Math.round((g.present / g.total) * 100) : 0;
  });
  Object.keys(byGender).forEach((gk) => {
    const g = byGender[gk];
    g.percentage = g.total > 0 ? Math.round((g.present / g.total) * 100) : 0;
  });

  res.json({ summary, totals, dailyTotals, dailyRecords, dailyByBatch, dailyByGender, byBatch, byGender });
});

module.exports = router;

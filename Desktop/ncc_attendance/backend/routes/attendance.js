const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();

router.use(authenticate);

async function nextAttendanceId() {
  const latest = await Attendance.findOne({}).sort({ id: -1 }).select('id').lean();
  return latest?.id ? latest.id + 1 : 1;
}

function normalizeAttendance(record) {
  return {
    id: record.id,
    regimentalNumber: record.regimentalNumber,
    cadetName: record.cadetName,
    date: record.date,
    status: record.status,
    note: record.note || '',
    recordedBy: record.recordedBy,
    recordedAt: record.recordedAt instanceof Date ? record.recordedAt.toISOString() : record.recordedAt
  };
}

router.get('/mine', async (req, res) => {
  const attendance = await Attendance.find({ regimentalNumber: req.user.regimentalNumber })
    .sort({ date: -1 })
    .lean();
  res.json({ attendance: attendance.map(normalizeAttendance) });
});

router.get('/all', authorizeAdmin, async (req, res) => {
  const { date } = req.query;
  const query = date ? { date } : {};
  const attendance = await Attendance.find(query).sort({ date: -1, regimentalNumber: 1 }).lean();

  res.json({ attendance: attendance.map(normalizeAttendance) });
});

router.get('/dates', authorizeAdmin, async (req, res) => {
  const dates = await Attendance.distinct('date');
  dates.sort((a, b) => b.localeCompare(a));
  res.json({ dates });
});

router.post('/', authorizeAdmin, async (req, res) => {
  const regimentalNumber = String(req.body.regimentalNumber || '').trim();
  const date = String(req.body.date || '').trim();
  const status = String(req.body.status || '').trim();
  const note = String(req.body.note || '');

  if (!regimentalNumber || !date || !status) {
    return res.status(400).json({ error: 'Regimental number, date, and status are required' });
  }

  const cadet = await User.findOne({ regimentalNumber, role: 'cadet' }).lean();
  if (!cadet) {
    return res.status(404).json({ error: 'Cadet not found' });
  }

  const existing = await Attendance.findOne({ regimentalNumber, date });
  const attendance = await Attendance.findOneAndUpdate(
    { regimentalNumber, date },
    {
      $set: {
        id: existing?.id || await nextAttendanceId(),
        regimentalNumber,
        cadetName: cadet.name,
        date,
        status,
        note,
        recordedBy: req.user.regimentalNumber,
        recordedAt: new Date()
      }
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json({ attendance: normalizeAttendance(attendance) });
});

router.post('/batch', authorizeAdmin, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Array of attendance entries required' });
  }

  const regimentalNumbers = Array.from(new Set(
    items.map((item) => String(item.regimentalNumber || '').trim()).filter(Boolean)
  ));
  const cadets = await User.find({ regimentalNumber: { $in: regimentalNumbers }, role: 'cadet' }).lean();
  const cadetByRegimental = new Map(cadets.map((cadet) => [cadet.regimentalNumber, cadet]));
  const updated = [];

  for (const item of items) {
    const regimentalNumber = String(item.regimentalNumber || '').trim();
    const date = String(item.date || '').trim();
    const status = String(item.status || '').trim();
    const note = String(item.note || '');

    if (!regimentalNumber || !date || !status) {
      continue;
    }

    const cadet = cadetByRegimental.get(regimentalNumber);
    if (!cadet) {
      continue;
    }

    const existing = await Attendance.findOne({ regimentalNumber, date });
    const record = await Attendance.findOneAndUpdate(
      { regimentalNumber, date },
      {
        $set: {
          id: existing?.id || await nextAttendanceId(),
          regimentalNumber,
          cadetName: cadet.name,
          date,
          status,
          note,
          recordedBy: req.user.regimentalNumber,
          recordedAt: new Date()
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    updated.push(normalizeAttendance(record));
  }

  res.status(201).json({ updated, count: updated.length });
});

router.get('/analytics', authorizeAdmin, async (req, res) => {
  const attendance = (await Attendance.find({}).lean()).map(normalizeAttendance);
  const cadets = await User.find({ role: 'cadet' }).lean();
  const today = new Date().toISOString().slice(0, 10);

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

  const dailyRecords = attendance.filter((record) => record.date === today);
  const dailyTotals = {
    present: dailyRecords.filter((record) => record.status === 'Present').length,
    absent: dailyRecords.filter((record) => record.status === 'Absent').length,
    late: dailyRecords.filter((record) => record.status === 'Late').length,
    totalRecords: dailyRecords.length,
    date: today,
    percentage: dailyRecords.length > 0 ? Math.round((dailyRecords.filter((record) => record.status === 'Present').length / dailyRecords.length) * 100) : 0
  };

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

  const totals = {
    present: attendance.filter((record) => record.status === 'Present').length,
    absent: attendance.filter((record) => record.status === 'Absent').length,
    late: attendance.filter((record) => record.status === 'Late').length,
    totalRecords: attendance.length,
    percentage: attendance.length > 0 ? Math.round((attendance.filter((record) => record.status === 'Present').length / attendance.length) * 100) : 0
  };

  const byGender = { SD: { present: 0, absent: 0, late: 0, total: 0 }, SW: { present: 0, absent: 0, late: 0, total: 0 }, UNKNOWN: { present: 0, absent: 0, late: 0, total: 0 } };
  const byBatch = {};

  attendance.forEach((rec) => {
    const rn = rec.regimentalNumber || '';
    const genderMatch = rn.match(/(SD|SW)/i);
    const gender = genderMatch ? genderMatch[0].toUpperCase() : 'UNKNOWN';
    const batchMatch = rn.match(/(20\d{2})/);
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

const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();
const VALID_STATUSES = new Set(['Present', 'Absent', 'Late']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

router.use(authenticate);

async function nextAttendanceId() {
  const latest = await Attendance.findOne({}).sort({ id: -1 }).select('id').lean();
  return latest?.id ? latest.id + 1 : 1;
}

function normalizeRegimentalNumber(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeNote(value) {
  return String(value || '').trim().slice(0, 300);
}

function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function parseAttendanceInput(item) {
  const regimentalNumber = normalizeRegimentalNumber(item.regimentalNumber);
  const date = String(item.date || '').trim();
  const status = String(item.status || '').trim();
  const note = normalizeNote(item.note);

  if (!regimentalNumber || !date || !status) {
    return { error: 'Regimental number, date, and status are required' };
  }
  if (!isValidDate(date)) {
    return { error: 'Attendance date must use YYYY-MM-DD format' };
  }
  if (!VALID_STATUSES.has(status)) {
    return { error: 'Attendance status must be Present, Absent, or Late' };
  }

  return { value: { regimentalNumber, date, status, note } };
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

function buildAttendanceBreakdowns(records) {
  const byGender = { SD: { present: 0, absent: 0, late: 0, total: 0 }, SW: { present: 0, absent: 0, late: 0, total: 0 }, UNKNOWN: { present: 0, absent: 0, late: 0, total: 0 } };
  const byBatch = {};

  records.forEach((rec) => {
    const rn = rec.regimentalNumber || '';
    const genderMatch = rn.match(/(SD|SW)/i);
    const gender = genderMatch ? genderMatch[0].toUpperCase() : 'UNKNOWN';
    const batchMatch = rn.match(/(20\d{2})/);
    const batch = batchMatch ? batchMatch[0] : 'unknown';

    if (!byBatch[batch]) byBatch[batch] = { present: 0, absent: 0, late: 0, total: 0 };
    if (!byGender[gender]) byGender[gender] = { present: 0, absent: 0, late: 0, total: 0 };

    byBatch[batch].total += 1;
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

  Object.values(byBatch).forEach((group) => {
    group.percentage = group.total > 0 ? Math.round((group.present / group.total) * 100) : 0;
  });
  Object.values(byGender).forEach((group) => {
    group.percentage = group.total > 0 ? Math.round((group.present / group.total) * 100) : 0;
  });

  return { byBatch, byGender };
}

router.get('/mine', async (req, res) => {
  const attendance = await Attendance.find({ regimentalNumber: req.user.regimentalNumber })
    .sort({ date: -1 })
    .lean();
  res.json({ attendance: attendance.map(normalizeAttendance) });
});

router.get('/all', authorizeAdmin, async (req, res) => {
  const date = String(req.query.date || '').trim();
  if (date && !isValidDate(date)) {
    return res.status(400).json({ error: 'Attendance date must use YYYY-MM-DD format' });
  }

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
  const parsed = parseAttendanceInput(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const { regimentalNumber, date, status, note } = parsed.value;
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
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(existing ? 200 : 201).json({ attendance: normalizeAttendance(attendance) });
});

router.post('/batch', authorizeAdmin, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Array of attendance entries required' });
  }
  if (items.length > 500) {
    return res.status(400).json({ error: 'Attendance batch cannot exceed 500 entries' });
  }

  const parsedItems = [];
  const seenKeys = new Set();

  for (const [index, item] of items.entries()) {
    const parsed = parseAttendanceInput(item || {});
    if (parsed.error) {
      return res.status(400).json({ error: `Entry ${index + 1}: ${parsed.error}` });
    }

    const key = `${parsed.value.regimentalNumber}|${parsed.value.date}`;
    if (seenKeys.has(key)) {
      return res.status(400).json({ error: `Duplicate attendance entry for ${parsed.value.regimentalNumber} on ${parsed.value.date}` });
    }

    seenKeys.add(key);
    parsedItems.push(parsed.value);
  }

  const regimentalNumbers = Array.from(new Set(parsedItems.map((item) => item.regimentalNumber)));
  const cadets = await User.find({ regimentalNumber: { $in: regimentalNumbers }, role: 'cadet' }).lean();
  const cadetByRegimental = new Map(cadets.map((cadet) => [cadet.regimentalNumber, cadet]));
  const missingCadets = regimentalNumbers.filter((regimentalNumber) => !cadetByRegimental.has(regimentalNumber));

  if (missingCadets.length > 0) {
    return res.status(404).json({ error: `Cadet not found: ${missingCadets.join(', ')}` });
  }

  let nextId = await nextAttendanceId();
  const updated = [];

  for (const item of parsedItems) {
    const cadet = cadetByRegimental.get(item.regimentalNumber);
    const existing = await Attendance.findOne({ regimentalNumber: item.regimentalNumber, date: item.date });
    const record = await Attendance.findOneAndUpdate(
      { regimentalNumber: item.regimentalNumber, date: item.date },
      {
        $set: {
          id: existing?.id || nextId,
          regimentalNumber: item.regimentalNumber,
          cadetName: cadet.name,
          date: item.date,
          status: item.status,
          note: item.note,
          recordedBy: req.user.regimentalNumber,
          recordedAt: new Date()
        }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    if (!existing) nextId += 1;
    updated.push(normalizeAttendance(record));
  }

  res.status(201).json({ updated, count: updated.length, message: `Attendance saved for ${updated.length} cadet${updated.length === 1 ? '' : 's'}` });
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
      rank: cadet.rank || 'Cadet',
      totals: { present, absent, late, total, percentage }
    };
  });

  const dailyRecords = attendance.filter((record) => record.date === today);
  const dailyPresent = dailyRecords.filter((record) => record.status === 'Present').length;
  const dailyTotals = {
    present: dailyPresent,
    absent: dailyRecords.filter((record) => record.status === 'Absent').length,
    late: dailyRecords.filter((record) => record.status === 'Late').length,
    totalRecords: dailyRecords.length,
    date: today,
    percentage: dailyRecords.length > 0 ? Math.round((dailyPresent / dailyRecords.length) * 100) : 0
  };

  const totalPresent = attendance.filter((record) => record.status === 'Present').length;
  const totals = {
    present: totalPresent,
    absent: attendance.filter((record) => record.status === 'Absent').length,
    late: attendance.filter((record) => record.status === 'Late').length,
    totalRecords: attendance.length,
    percentage: attendance.length > 0 ? Math.round((totalPresent / attendance.length) * 100) : 0
  };

  const dailyBreakdowns = buildAttendanceBreakdowns(dailyRecords);
  const overallBreakdowns = buildAttendanceBreakdowns(attendance);

  res.json({
    summary,
    totals,
    dailyTotals,
    dailyRecords,
    dailyByBatch: dailyBreakdowns.byBatch,
    dailyByGender: dailyBreakdowns.byGender,
    byBatch: overallBreakdowns.byBatch,
    byGender: overallBreakdowns.byGender
  });
});

module.exports = router;

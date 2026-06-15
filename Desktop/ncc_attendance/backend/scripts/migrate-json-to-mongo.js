require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectDb } = require('../services/db');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

function readJson(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function migrateUsers(users) {
  let migrated = 0;

  for (const user of users) {
    if (user.role !== 'cadet' || !user.regimentalNumber || !user.name || !user.unit || !user.passwordHash) {
      continue;
    }

    await User.findOneAndUpdate(
      { regimentalNumber: user.regimentalNumber },
      {
        $set: {
          regimentalNumber: user.regimentalNumber,
          name: user.name,
          unit: user.unit,
          role: 'cadet',
          passwordHash: user.passwordHash
        }
      },
      { upsert: true, runValidators: true }
    );
    migrated += 1;
  }

  return migrated;
}

async function migrateAttendance(records) {
  let migrated = 0;

  for (const record of records) {
    if (!record.regimentalNumber || !record.date || !record.status || !record.cadetName) {
      continue;
    }

    await Attendance.findOneAndUpdate(
      { regimentalNumber: record.regimentalNumber, date: record.date },
      {
        $set: {
          id: record.id,
          regimentalNumber: record.regimentalNumber,
          cadetName: record.cadetName,
          date: record.date,
          status: record.status,
          note: record.note || '',
          recordedBy: record.recordedBy || process.env.ADMIN_REGIMENTAL || 'migration',
          recordedAt: record.recordedAt ? new Date(record.recordedAt) : new Date()
        }
      },
      { upsert: true, runValidators: true }
    );
    migrated += 1;
  }

  return migrated;
}

async function main() {
  await connectDb();

  const users = readJson('users.json');
  const attendance = readJson('attendance.json');

  const userCount = await migrateUsers(users);
  const attendanceCount = await migrateAttendance(attendance);

  console.log(`Migrated ${userCount} cadet user(s).`);
  console.log(`Migrated ${attendanceCount} attendance record(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

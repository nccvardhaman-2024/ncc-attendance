const fs = require('fs');
const path = require('path');

function readJson(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJson(fileName, data) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getUsers() {
  return readJson('users.json') || [];
}

function saveUsers(users) {
  writeJson('users.json', users);
}

function getAttendance() {
  return readJson('attendance.json') || [];
}

function saveAttendance(attendanceRecords) {
  writeJson('attendance.json', attendanceRecords);
}

module.exports = { getUsers, saveUsers, getAttendance, saveAttendance };

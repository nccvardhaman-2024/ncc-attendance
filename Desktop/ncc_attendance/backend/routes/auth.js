const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getUsers } = require('../services/dataStore');
const { JWT_SECRET } = require('../middleware/auth');

const ADMIN_REGIMENTAL = process.env.ADMIN_REGIMENTAL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const router = express.Router();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

router.post('/login', (req, res) => {
  const { regimentalNumber, password } = req.body;
  if (!regimentalNumber || !password) {
    return res.status(400).json({ error: 'Regimental number and password are required' });
  }

  if (regimentalNumber === ADMIN_REGIMENTAL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      {
        regimentalNumber: ADMIN_REGIMENTAL,
        name: 'NCC Admin',
        role: 'admin',
        unit: 'Head Office'
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, user: { regimentalNumber: ADMIN_REGIMENTAL, name: 'NCC Admin', role: 'admin', unit: 'Head Office' } });
  }

  const users = getUsers();
  const user = users.find((item) => item.regimentalNumber === regimentalNumber && item.role === 'cadet');
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      regimentalNumber: user.regimentalNumber,
      name: user.name,
      role: user.role,
      unit: user.unit
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, user: { regimentalNumber: user.regimentalNumber, name: user.name, role: user.role, unit: user.unit } });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: payload });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;

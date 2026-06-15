const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middleware/auth');
const User = require('../models/User');

const ADMIN_REGIMENTAL = process.env.ADMIN_REGIMENTAL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || 'NCC Admin';
const ADMIN_UNIT = process.env.ADMIN_UNIT || 'Head Office';

const router = express.Router();

if (!ADMIN_REGIMENTAL || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_REGIMENTAL and ADMIN_PASSWORD environment variables are required');
}

function legacySha256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

router.post('/login', async (req, res) => {
  const regimentalNumber = String(req.body.regimentalNumber || '').trim();
  const password = String(req.body.password || '');

  if (!regimentalNumber || !password) {
    return res.status(400).json({ error: 'Regimental number and password are required' });
  }

  if (regimentalNumber === ADMIN_REGIMENTAL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      {
        regimentalNumber: ADMIN_REGIMENTAL,
        name: ADMIN_NAME,
        role: 'admin',
        unit: ADMIN_UNIT
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, user: { regimentalNumber: ADMIN_REGIMENTAL, name: ADMIN_NAME, role: 'admin', unit: ADMIN_UNIT } });
  }

  const user = await User.findOne({ regimentalNumber, role: 'cadet' });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isBcryptHash = user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2y$');
  const passwordMatches = isBcryptHash
    ? bcrypt.compareSync(password, user.passwordHash)
    : user.passwordHash === legacySha256(password);

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!isBcryptHash) {
    user.passwordHash = bcrypt.hashSync(password, 12);
    await user.save();
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(regimentalNumber, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regimentalNumber, password })
  });
  return response.json();
}

export async function fetchMe(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function fetchCadetAttendance(token) {
  const response = await fetch(`${API_URL}/attendance/mine`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function fetchCadets(token) {
  const response = await fetch(`${API_URL}/cadets`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function createCadet(token, payload) {
  const response = await fetch(`${API_URL}/cadets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function fetchAttendanceDates(token) {
  const response = await fetch(`${API_URL}/attendance/dates`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function fetchAttendanceByDate(token, date) {
  const response = await fetch(`${API_URL}/attendance/all?date=${encodeURIComponent(date)}`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function fetchAttendanceAll(token) {
  const response = await fetch(`${API_URL}/attendance/all`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function updateCadet(token, originalRegimentalNumber, payload) {
  const response = await fetch(`${API_URL}/cadets/${encodeURIComponent(originalRegimentalNumber)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function submitAttendanceBatch(token, payload) {
  const response = await fetch(`${API_URL}/attendance/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function fetchAnalytics(token) {
  const response = await fetch(`${API_URL}/attendance/analytics`, {
    headers: { ...authHeaders(token) }
  });
  return response.json();
}

export async function submitAttendance(token, payload) {
  const response = await fetch(`${API_URL}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
  return response.json();
}

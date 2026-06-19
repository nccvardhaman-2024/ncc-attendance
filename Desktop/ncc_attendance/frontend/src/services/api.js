const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (err) {
    return { error: 'Unable to connect to the server. Please check the backend and database connection.' };
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : {};

  if (!response.ok) {
    return { error: data.error || `Request failed with status ${response.status}` };
  }

  return data;
}

export async function login(regimentalNumber, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regimentalNumber, password })
  });
}

export async function fetchMe(token) {
  return request('/auth/me', {
    headers: { ...authHeaders(token) }
  });
}

export async function fetchCadetAttendance(token) {
  return request('/attendance/mine', {
    headers: { ...authHeaders(token) }
  });
}

export async function fetchCadets(token) {
  return request('/cadets', {
    headers: { ...authHeaders(token) }
  });
}

export async function createCadet(token, payload) {
  return request('/cadets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
}

export async function fetchAttendanceDates(token) {
  return request('/attendance/dates', {
    headers: { ...authHeaders(token) }
  });
}

export async function fetchAttendanceByDate(token, date) {
  return request(`/attendance/all?date=${encodeURIComponent(date)}`, {
    headers: { ...authHeaders(token) }
  });
}

export async function fetchAttendanceAll(token) {
  return request('/attendance/all', {
    headers: { ...authHeaders(token) }
  });
}

export async function updateCadet(token, originalRegimentalNumber, payload) {
  return request(`/cadets/${encodeURIComponent(originalRegimentalNumber)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
}

export async function submitAttendanceBatch(token, payload) {
  return request('/attendance/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
}

export async function fetchAnalytics(token) {
  return request('/attendance/analytics', {
    headers: { ...authHeaders(token) }
  });
}

export async function submitAttendance(token, payload) {
  return request('/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload)
  });
}

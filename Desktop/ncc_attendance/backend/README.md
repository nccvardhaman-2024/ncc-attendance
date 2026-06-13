# NCC Attendance Backend

Express API for the NCC Attendance Management System.

## Setup

```bash
cd backend
npm install
npm start
```

## Default values

- Port: `5000`
- Login endpoint: `/api/auth/login`
- Attendance endpoints: `/api/attendance/*`

## Example admin credentials

- Regimental number: `NCCADMIN01`
- Password: `admin123`

## Cadet creation

- Cadets are added by the admin using the `/api/cadets` route.
- The user list starts empty in `backend/data/users.json`.

## Environment variables for Render

- `PORT=5000`
- `JWT_SECRET=<your-secret>`
- `FRONTEND_URL=https://<your-cloudflare-site>`

## Notes

- The backend uses a JSON data store in `backend/data/`.
- Cadets can only read their own attendance via `/api/attendance/mine`.
- Only admin users can POST attendance via `/api/attendance`.

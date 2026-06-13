# NCC Attendance Management

A full-stack NCC cadet attendance system with a React + Tailwind frontend and Node.js backend. The admin can record attendance, while cadets can securely view only their own attendance records.

## Features

- Admin login using regimental number
- Admin-only cadet creation and management
- Cadet read-only login after creation
- Admin-only attendance entry by date
- Attendance analytics and cadet summaries
- Clean landing page and separate admin pages
- Deployment-ready for Render (backend) and Cloudflare Pages (frontend)

## Folder structure

- `backend/`: Node.js Express API
- `frontend/`: Vite + React + Tailwind frontend

## Backend quick start

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:5000` by default.

### Admin credentials

- Regimental number: `NCCADMIN01`
- Password: `admin123`

### Cadet accounts

- Cadets are created by the admin after login.
- The backend starts with an empty cadet list in `backend/data/users.json`.

## Frontend quick start

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Deployment notes

### Render backend

- Create a new Render web service
- Set the environment variables:
  - `PORT=5000`
  - `JWT_SECRET=<your-secret>`
  - `FRONTEND_URL=https://<your-cloudflare-site>`
- Use `npm install` and `npm start`

### Cloudflare Pages frontend

- Connect the `frontend` folder
- Set the build command to `npm install && npm run build`
- Set the publish directory to `dist`
- Add an environment variable: `VITE_API_URL=https://<your-render-backend>/api`

## Notes

- Cadets cannot modify attendance; only admin has write access.
- The login system is based on regimental number plus password.
- The frontend is designed for modern deployment and mobile-first use.

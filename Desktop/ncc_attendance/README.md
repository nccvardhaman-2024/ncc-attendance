# NCC Attendance Management

A full-stack NCC cadet attendance system with a React + Tailwind frontend, Node.js/Express backend, and MongoDB Atlas database. The admin can record attendance, while cadets can securely view only their own attendance records.

## Features

- Admin login using regimental number
- Admin-only cadet creation and management
- Cadet read-only login after creation
- Admin-only attendance entry by date
- Attendance analytics and cadet summaries
- Clean landing page and separate admin pages
- Deployment-ready for Render (backend) and Cloudflare Pages (frontend)

## Folder structure

- `backend/`: Node.js Express API with MongoDB Atlas storage
- `frontend/`: Vite + React + Tailwind frontend

## Backend quick start

```bash
cd backend
npm install
copy .env.example .env
npm start
```

The backend runs on `http://localhost:5000` by default.

### Required backend environment variables

- `JWT_SECRET`: long random string used to sign login tokens
- `MONGODB_URI`: MongoDB Atlas connection string
- `ADMIN_REGIMENTAL`: admin regimental/login number
- `ADMIN_PASSWORD`: admin password
- `FRONTEND_URL`: allowed frontend origin, for example `https://<your-cloudflare-site>`

### Cadet accounts

- Cadets are created by the admin after login.
- Cadet passwords are stored as bcrypt hashes.

### Migrate old JSON data to MongoDB

If you already have `backend/data/users.json` and `backend/data/attendance.json`, set `MONGODB_URI` in `backend/.env`, then run:

```bash
cd backend
npm run migrate:json
```

The script upserts cadets and attendance into MongoDB. Old SHA-256 cadet password hashes are still accepted and are upgraded to bcrypt when each cadet logs in.

## Frontend quick start

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Deployment notes

### Render backend

- Create a new Render Web Service from this repository.
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Set the environment variables:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `JWT_SECRET=<long-random-secret>`
  - `MONGODB_URI=<your-mongodb-atlas-connection-string>`
  - `ADMIN_REGIMENTAL=<admin-login-number>`
  - `ADMIN_PASSWORD=<strong-admin-password>`
  - `FRONTEND_URL=https://<your-cloudflare-site>`

### Cloudflare Pages frontend

- Connect this repository to Cloudflare Pages
- Root directory: `frontend`
- Set the build command to `npm run build`
- Set the publish directory to `dist`
- Add an environment variable: `VITE_API_URL=https://<your-render-backend>/api`

### MongoDB Atlas

- Create an Atlas cluster.
- Create a database user with read/write access.
- Add Render's outbound IPs in Atlas Network Access, or use `0.0.0.0/0` only if you accept the wider access tradeoff.
- Copy the application connection string and set it as `MONGODB_URI` in Render.
- Use a database name in the URI, for example:

```text
mongodb+srv://username:password@cluster-url/ncc_attendance?retryWrites=true&w=majority
```

## Notes

- Cadets cannot modify attendance; only admin has write access.
- The login system is based on regimental number plus password.
- The frontend is designed for modern deployment and mobile-first use.

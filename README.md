# CipherStudio

A browser-based React IDE where you can create/edit multiple files, run a live React preview, and save/load projects locally or to a backend with authentication.

## Monorepo Structure

- `frontend/` — Vite + React app with Sandpack editor/preview
- `backend/` — Node/Express API with MongoDB (Mongoose) and JWT auth

---

## Features

- **File management**: create, delete, rename files in a virtual project
- **Code editor + live preview**: powered by Sandpack (CodeSandbox)
- **Save/Load**:
  - Local: `localStorage` by `projectId`
  - Backend: authenticated CRUD per user
- **Auth**: register/login, token stored in browser
- **UX**: theme switch, autosave, project id in URL (`?id=...`)

---

## Prerequisites

- Node.js 18+
- A MongoDB connection string (MongoDB Atlas recommended)

---

## Backend Setup

1. Create `backend/.env` (example):
   ```env
   PORT=4000
   MONGODB_URI=YOUR_MONGODB_URI
   JWT_SECRET=some-strong-secret
   ```
2. Install and run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Health check: `GET http://localhost:4000/api/health` → `{ ok: true, dbConnected: true }`

### API Overview

- `POST /api/auth/register` — `{ email, password, name }` → `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- Authenticated routes require header: `Authorization: Bearer <token>`
- `GET /api/projects` — list user's projects
- `POST /api/projects` — create `{ name, files:[{path,code}], settings }`
- `GET /api/projects/:projectId` — fetch by `projectId`
- `PUT /api/projects/:projectId` — update
- `DELETE /api/projects/:projectId` — delete

Project document shape:
```json
{
  "projectId": "proj-abc123",
  "name": "My Project",
  "files": [{ "path": "/App.js", "code": "..." }],
  "settings": { "theme": "dark", "autosave": true }
}
```

---

## Frontend Setup

1. Create `frontend/.env`:
   ```env
   VITE_API_BASE=http://localhost:4000
   ```
2. Install and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open the printed URL (default `http://localhost:5173`).

### Usage

- On the **Home** screen, Register or Login.
- In the **IDE**:
  - Change files in Sandpack. Preview updates live.
  - Set a `projectId` in the toolbar.
  - **Save**:
    - If logged in and `projectId` is empty/`local`, a new id is generated and saved to backend.
    - If not logged in, saves locally.
  - **Load** loads from backend (if authed) or local fallback.

---

## Tech Stack

- Frontend: React, Vite, `@codesandbox/sandpack-react`
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- DB: MongoDB (Atlas)

---

## Deployment (suggested)

- Frontend: Vercel (build command `npm run build`, output `dist/`)
- Backend: Render/Railway/Cyclic (Node), set env vars `PORT`, `MONGODB_URI`, `JWT_SECRET`
- Update `VITE_API_BASE` to the deployed backend URL

---

## Notes & Tips

- If login returns `404/503`, ensure the backend is running with the latest code and Mongo is connected.
- For local-only usage, set `projectId = local` and use Save/Load.
- Query param `?id=<projectId>` will preselect a project on load.

---

## Scripts Reference

- Backend:
  - `npm run dev` — start Express server
- Frontend:
  - `npm run dev` — start Vite dev
  - `npm run build` — production build
  - `npm run preview` — preview production build

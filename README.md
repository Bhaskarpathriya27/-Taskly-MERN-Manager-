## Taskly – MERN Task Management

This project delivers a full-stack task management experience with a React + Vite frontend styled with Tailwind CSS and shadcn-inspired components, and an Express + MongoDB backend. The frontend is ready to deploy (Vercel/Netlify) and the backend now persists users/tasks inside MongoDB Atlas (or any Mongo instance you point it to).

### Stack

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui primitives, Axios, React Router, Sonner toasts.
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), bcrypt-secured auth sessions.

### Local Development

```bash
# 1. start the API (http://localhost:4000)
cd backend
npm install
npm run dev

# 2. start the React app (http://localhost:5173)
cd ../frontend
npm install
npm run dev
```

The backend expects the following environment variables (create `backend/.env`):

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=Taskify
PORT=4000
```

The frontend reads the API base from `VITE_API_URL` (defaults to the deployed backend at `https://taskly-mern-manager-production.up.railway.app`). Create a `.env` inside `frontend` if you need to override:

```
VITE_API_URL=https://taskly-mern-manager-production.up.railway.app
```

### Mock Credentials

- **Admin**: `admin@example.com / admin123` – can create, edit, and delete any task.
- **User**: `user@example.com / user123` – can create/edit their own tasks (delete hidden).

### Production Build

```bash
# frontend bundle
cd frontend && npm run build

# backend (optional) production start
cd backend && npm run start
```

# Free Hosting Guide

## Backend (FastAPI) on Render (free tier)

Prereqs:
- GitHub repo (push this project)
- MongoDB Atlas cluster and connection string

Steps:
1. Create an account at https://render.com and click New → Web Service.
2. Connect your GitHub repo and select the `backend/` folder as the root by setting:
   - Root directory: `backend`
   - Environment: `Docker`
3. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `GOOGLE_OAUTH_CLIENT_ID` = (optional) if you use Google login
   - `PORT` = 8000 (Render sets one automatically, we also default to 8000)
4. Deployment will build the Docker image using `backend/Dockerfile` and run `uvicorn`.
5. After deploy, note your Render service URL (e.g., `https://your-app.onrender.com`).

## Frontend (Create React App) on Netlify or Vercel (free)

Option A: Netlify
1. Create an account at https://www.netlify.com/ → Add new site → Import from Git.
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. Environment variables:
   - `REACT_APP_API_BASE_URL` = Backend URL from Render
4. Deploy. Netlify will give you a public site URL.

Option B: Vercel
1. Create an account at https://vercel.com/ → Add New Project → Import Git.
2. Project settings:
   - Root Directory: `frontend`
   - Framework Preset: Create React App
3. Environment variables:
   - `REACT_APP_API_BASE_URL` = Backend URL from Render
4. Deploy and use the generated domain.

## Local dev env files

- `backend/env.example` → copy to `backend/.env` and fill values.
- `frontend/env.example` → copy to `frontend/.env` and set `REACT_APP_API_BASE_URL`.

## CORS

`backend/app.py` allows all origins. For stricter security, replace `"*"` with your frontend domain.

## Notes

- The backend expects `MONGODB_URI` and `JWT_SECRET` in the environment.
- Dockerfile is configured to honor the `$PORT` variable required by free hosts.


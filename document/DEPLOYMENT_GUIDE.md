# Deployment Guide

## 1. Frontend Deployment (Vercel)
Vercel is the optimal choice for Next.js applications due to seamless integration.

**Steps:**
1. Connect GitHub repository to Vercel.
2. Select the `frontend` folder as the Root Directory.
3. Vercel automatically detects Next.js and configures build commands (`npm run build`).
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com/v1`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. Enable Vercel Analytics for tracking page views.

## 2. Backend Deployment (Render or Railway)
Both platforms offer easy Docker-based or Node-based deployments.

**Steps (Render):**
1. Create a new Web Service and link the GitHub repository.
2. Select the `backend` folder as the Root Directory.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start` (points to `dist/app.js`).
5. Set Environment Variables:
   - `PORT` = `8080`
   - `MONGO_URI` = `mongodb+srv://...`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `FRONTEND_URL` = `https://yourdomain.com` (for CORS)

## 3. Database Deployment (MongoDB Atlas)
1. Create a shared or dedicated cluster on MongoDB Atlas.
2. Add the deployment server IP (or `0.0.0.0/0` for Render/Railway dynamic IPs) to the Network Access whitelist.
3. Create a Database User with strong credentials.
4. Obtain the Connection String (`MONGO_URI`).

## 4. Environment Variables Checklist
### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`.env`)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/platform
JWT_SECRET=super_secret_string
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=another_super_secret_string
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://platform.com
```

## 5. CI/CD Suggestions
- Use GitHub Actions to run ESLint and Jest tests on PR creation.
- Prevent merging to `main` if tests fail.
- Auto-deploy to Vercel and Render upon merge to `main`.

## 6. Production Optimization
- Enable Gzip/Brotli compression in Express.
- Setup a reverse proxy cache or CDN (Vercel handles this for frontend, but backend may need Redis for heavy analytics queries in the future).
- Implement Winston logger dumping to a service like Datadog or AWS CloudWatch.

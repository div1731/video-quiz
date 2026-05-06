# Architecture: Interactive Video Quiz Platform

## 1. System Architecture
The platform follows a standard decouple client-server RESTful architecture.
- **Client:** Next.js (App Router) serving dynamic React components, styled with Tailwind CSS.
- **Server:** Node.js with Express.js acting as the REST API gateway.
- **Database:** MongoDB (via Atlas) accessed using Mongoose ODM.
- **External Services:** Google OAuth, YouTube IFrame API.

## 2. Frontend/Backend Communication
- **Protocol:** HTTPS REST APIs.
- **Payload Format:** JSON.
- **Client HTTP Client:** Axios with interceptors for attaching JWT tokens to requests.
- **State Synchronization:** React Query (or Zustand for global UI state) to cache and sync server data.

## 3. Authentication Flow
- **Registration/Login:** Client sends credentials -> Server validates & hashes -> Server issues JWT Access Token (short-lived, 15m) and Refresh Token (HttpOnly Cookie, 7d).
- **Session Management:** Client stores Access Token in memory/Zustand. On expiry, Axios interceptor silently requests a new Access Token using the HttpOnly Refresh Token.
- **OAuth:** Google OAuth flow via Passport.js or custom Google Auth Library verification.

## 4. Video Interaction Flow
1. **Load:** Client fetches Quiz metadata (video ID, questions, timestamps) from API.
2. **Initialize:** YouTube IFrame API loads the video.
3. **Monitor:** A `requestAnimationFrame` or interval loop checks the current playback time against the next question timestamp.
4. **Trigger:** When time hits timestamp, player pauses -> React state `isQuestionActive` becomes true -> Modal renders.
5. **Resume:** User submits answer -> Client records attempt -> Player resumes.

## 5. Analytics Flow
- **Event Tracking:** Client dispatches lightweight async POST requests for events (video started, question answered, video completed).
- **Batching (Scalability):** Future consideration: batch analytics events on the client and send every 5 seconds to reduce DB write load.
- **Aggregation:** MongoDB aggregation pipelines are used to compute dashboard stats (e.g., average score, completion rate).

## 6. State Management Architecture
- **Local State:** `useState` for component-level toggles (modals, forms).
- **Form State:** `React Hook Form` integrated with `Zod` for validation.
- **Global UI State:** `Zustand` for sidebar toggles, theme, user profile.
- **Server State:** `SWR` or `React Query` (or Redux Toolkit Query) for caching API responses (dashboard data, quizzes).

## 7. Deployment Architecture
- **Frontend:** Deployed to Vercel (Edge caching, serverless rendering for SEO pages).
- **Backend:** Deployed to Render or Railway (Dockerized Node.js app).
- **Database:** MongoDB Atlas (Dedicated cluster or Serverless).
- **Static Assets:** AWS S3 or Cloudinary (for user avatars or custom thumbnails).

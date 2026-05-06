# Development Task Roadmap

This roadmap outlines the phased development of the Interactive Video Quiz Platform.

## Phase 1: Project Setup & Architecture (Days 1-2)
- **Task 1:** Initialize monorepo or dual-repo structure (Frontend/Backend).
- **Task 2:** Setup Next.js with Tailwind CSS and Shadcn UI.
- **Task 3:** Setup Express.js with TypeScript and Nodemon.
- **Task 4:** Provision MongoDB Atlas Cluster and connect backend.
- **Priority:** High | **Complexity:** Low

## Phase 2: Authentication System (Days 3-5)
- **Task 1:** Create User Mongoose Model.
- **Task 2:** Implement JWT-based registration and login APIs.
- **Task 3:** Build Frontend Login, Register, and Forgot Password pages.
- **Task 4:** Setup Zustand auth store and Axios interceptors for token refresh.
- **Priority:** High | **Complexity:** Medium

## Phase 3: Dashboard UI & Management (Days 6-8)
- **Task 1:** Create Dashboard layout with Sidebar and Header.
- **Task 2:** Build Quiz CRUD APIs in backend.
- **Task 3:** Implement Frontend "My Quizzes" list view.
- **Task 4:** Build simple settings page for user profile.
- **Priority:** High | **Complexity:** Medium

## Phase 4: Quiz Builder Development (Days 9-14)
- **Task 1:** Develop Quiz Model and Question Model schemas.
- **Task 2:** Build the Quiz Builder UI (Split screen: Video preview on left, Question timeline on right).
- **Task 3:** Integrate YouTube IFrame API to fetch metadata and allow timestamp selection.
- **Task 4:** Implement drag-and-drop or simple input for adding questions at timestamps.
- **Task 5:** API endpoints to save the quiz configuration.
- **Priority:** High | **Complexity:** High

## Phase 5: Interactive Video Player (Days 15-20)
- **Task 1:** Build the public `/play/:slug` route.
- **Task 2:** Implement robust YouTube Player wrapper that polls current time.
- **Task 3:** Logic to auto-pause video when current time >= question timestamp.
- **Task 4:** Render question modal overlay and block video controls.
- **Task 5:** Submit answer to backend (Attempt APIs) and resume playback.
- **Priority:** High | **Complexity:** High

## Phase 6: Analytics System (Days 21-25)
- **Task 1:** Create Session and Attempt MongoDB models.
- **Task 2:** Write MongoDB Aggregation pipelines to calculate average scores and completion rates.
- **Task 3:** Build API endpoints to expose analytics data.
- **Task 4:** Frontend Analytics Dashboard using Recharts or Chart.js to visualize data.
- **Priority:** Medium | **Complexity:** High

## Phase 7: Deployment (Days 26-28)
- **Task 1:** Setup GitHub Actions for CI/CD.
- **Task 2:** Deploy Backend to Render/Railway.
- **Task 3:** Deploy Frontend to Vercel.
- **Task 4:** Configure custom domains and SSL.
- **Priority:** High | **Complexity:** Medium

## Phase 8: Optimization & Polish (Days 29-30)
- **Task 1:** Security audit (Rate limiting, Helmet, CORS).
- **Task 2:** Mobile responsiveness polish for the Player and Dashboard.
- **Task 3:** Add SEO tags to public pages.
- **Priority:** Low | **Complexity:** Low

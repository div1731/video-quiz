# Frontend Structure (Next.js App Router)

Uses Next.js App Router (`/app` directory), React 18, Tailwind CSS, and Zustand.

## 1. Directory Structure
```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/        # Dashboard layout group
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── quizzes/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── play/               # Public quiz player
│   │   │   └── [slug]/page.tsx
│   │   ├── admin/              # Admin panel
│   │   ├── layout.tsx          # Root layout (Providers, Fonts)
│   │   └── page.tsx            # Landing Page
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn/radix primitives (buttons, inputs)
│   │   ├── forms/              # Form components (react-hook-form wrappers)
│   │   ├── dashboard/          # Dashboard specific components
│   │   ├── player/             # Video player & interaction components
│   │   └── shared/             # Navbars, footers, loaders
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useVideoPlayer.ts   # YouTube iframe logic
│   │   └── useQuizBuilder.ts
│   ├── lib/                    # Utility functions & Axios setup
│   │   ├── axios.ts            # Axios instance with interceptors
│   │   ├── utils.ts            # Tailwind class merging (clsx, tailwind-merge)
│   │   └── validations.ts      # Zod schemas
│   ├── store/                  # Zustand global state
│   │   ├── authStore.ts
│   │   └── builderStore.ts
│   └── types/                  # TypeScript interfaces
│       ├── api.types.ts
│       └── model.types.ts
```

## 2. Component Architecture
- **Dumb/Presentational Components:** Pure UI components in `components/ui/` (e.g., `<Button>`, `<Modal>`).
- **Smart/Container Components:** Components in `app/` or feature folders that fetch data and manage state.
- **Client Components:** Marked with `"use client"`. Used for interactivity (forms, video player, charts).
- **Server Components:** Default in Next.js. Used for SEO pages (Landing page) and initial data fetching.

## 3. State Management
- **Zustand:** Used for lightweight global state like the currently logged-in user profile, and complex local state spanning multiple components (e.g., the Quiz Builder timeline).
- **React Hook Form:** Manages all form states.
- **TanStack Query (optional but recommended):** Used for fetching, caching, and invalidating API data (quizzes, analytics).

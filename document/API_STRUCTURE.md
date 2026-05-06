# API Structure & Endpoints

Base URL: `/api/v1`

## 1. Authentication APIs (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login with email/pass | No |
| POST | `/auth/google` | Google OAuth login | No |
| POST | `/auth/refresh` | Get new access token | Refresh Token |
| POST | `/auth/logout` | Clear refresh cookie | Yes |
| GET | `/auth/me` | Get current user profile | Yes |

## 2. Quiz CRUD APIs (`/quizzes`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/quizzes` | Create new quiz | Yes |
| GET | `/quizzes` | List user's quizzes | Yes |
| GET | `/quizzes/:id` | Get quiz details & questions | Yes |
| PUT | `/quizzes/:id` | Update quiz metadata | Yes |
| DELETE | `/quizzes/:id` | Delete quiz | Yes |
| GET | `/quizzes/public/:slug` | Get public quiz by slug | No |

## 3. Question APIs (`/quizzes/:quizId/questions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/.../questions` | Add question | Yes |
| PUT | `/.../questions/:qId` | Update question | Yes |
| DELETE | `/.../questions/:qId`| Delete question | Yes |

## 4. Interaction & Attempt APIs (`/play`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/play/session` | Start a viewing session | No |
| POST | `/play/attempt` | Submit an answer | No |
| PUT | `/play/session/:id` | Complete session | No |

## 5. Analytics APIs (`/analytics`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/dashboard` | High-level metrics | Yes |
| GET | `/analytics/quizzes/:id`| Stats for specific quiz | Yes |
| GET | `/analytics/sessions` | Recent viewer sessions | Yes |

## 6. Middleware Structure
- `requireAuth`: Verifies JWT access token in `Authorization: Bearer <token>`.
- `requireAdmin`: Checks if `req.user.role === 'admin'`.
- `validate(schema)`: Joi/Zod middleware to validate request body/params.
- `rateLimiter`: Express-rate-limit to prevent brute force (e.g., on `/auth/login`).
- `quizOwner`: Ensures the authenticated user owns the quiz being modified.

## 7. Error Handling Strategy
- Global Error Handler middleware.
- Custom `AppError` class extending `Error` with `statusCode` and `isOperational`.
- Standardized response format:
  ```json
  {
    "status": "error",
    "message": "Validation failed",
    "errors": [{ "field": "email", "message": "Invalid email format" }]
  }
  ```

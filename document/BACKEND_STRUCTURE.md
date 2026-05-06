# Backend Structure (Node.js & Express)

Uses Node.js, Express.js, Mongoose, and a standard controller-service-repository architecture for clean separation of concerns.

## 1. Directory Structure
```text
backend/
├── src/
│   ├── config/              # Environment vars & database connection
│   │   ├── env.ts
│   │   └── db.ts
│   ├── controllers/         # HTTP request/response handlers
│   │   ├── auth.controller.ts
│   │   ├── quiz.controller.ts
│   │   └── analytics.controller.ts
│   ├── services/            # Core business logic
│   │   ├── auth.service.ts
│   │   └── quiz.service.ts
│   ├── models/              # Mongoose schemas
│   │   ├── user.model.ts
│   │   ├── quiz.model.ts
│   │   └── attempt.model.ts
│   ├── routes/              # Express route definitions
│   │   ├── auth.routes.ts
│   │   ├── quiz.routes.ts
│   │   └── index.ts         # Main router
│   ├── middleware/          # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── utils/               # Helper functions
│   │   ├── AppError.ts      # Custom error class
│   │   ├── jwt.ts           # Token generation/verification
│   │   └── logger.ts        # Winston or Pino logger
│   └── app.ts               # Express app setup
├── package.json
└── tsconfig.json
```

## 2. Architecture Pattern
- **Routes:** Map HTTP endpoints to Controller methods.
- **Controllers:** Extract `req.body`, `req.params`, call the appropriate Service, and format the `res`.
- **Services:** Execute business logic, interact with Models (Database), and throw `AppError` if something fails.
- **Models:** Define the data schema and Mongoose-specific hooks (e.g., pre-save password hashing).

## 3. Middleware Structure
- **Global:** `helmet()` for headers, `cors()` for cross-origin, `express.json()` for parsing.
- **Route-specific:**
  - `requireAuth`: Verifies JWT from headers and attaches user payload to `req.user`.
  - `validateRequest`: Uses Zod to validate incoming JSON against a schema.
- **Error Handling:** `errorHandler` middleware catches synchronous and asynchronous errors and returns a formatted JSON response.

## 4. Error Handling Strategy
- All errors are wrapped in a generic `catchAsync` utility to avoid `try/catch` blocks in every controller.
- `AppError` specifies HTTP status codes.
- The error middleware formats errors based on `NODE_ENV` (hiding stack traces in production).

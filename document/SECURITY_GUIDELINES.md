# Security Guidelines & Best Practices

To ensure the SaaS platform is production-ready and user data is protected, adhere to these guidelines.

## 1. Authentication Security
- **JWT Storage:** Never store JWT Access Tokens in `localStorage` due to XSS risks. Store them in application memory (Zustand) or short-lived cookies.
- **Refresh Tokens:** Store Refresh Tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies. This prevents JavaScript access and mitigates CSRF.
- **Password Hashing:** Use `bcrypt` with a minimum salt round of 10 or `argon2`.

## 2. API Security
- **Rate Limiting:** Implement `express-rate-limit`.
  - Global API limit: 1000 requests / 15 minutes per IP.
  - Auth routes limit: 5 requests / 15 minutes per IP (prevent brute force).
- **Helmet:** Use `helmet()` in Express to set secure HTTP headers (e.g., `X-Content-Type-Options`, `X-Frame-Options`).
- **CORS:** Strictly configure CORS to only allow requests from the production frontend domain.

## 3. Data Protection & Validation
- **Input Validation:** Use `Zod` on the frontend and backend to validate all incoming data. Reject unexpected fields.
- **NoSQL Injection:** Mongoose inherently protects against many NoSQL injections by casting to strict schemas. Additionally, use `express-mongo-sanitize` to strip out keys containing `$` or `.`.
- **XSS Protection:** Next.js and React automatically escape variables in JSX. Avoid `dangerouslySetInnerHTML`. If necessary, sanitize HTML input using `DOMPurify`.

## 4. Video & Quiz Anti-Cheat
- **Client-Side:** While true anti-cheat is impossible on a purely client-side browser video player, obfuscate the API responses containing the `isCorrect` flags if possible, or validate answers strictly server-side (only sending options, not the correct answer, to the client).
- **Server-Side Validation:** The backend must calculate the score. Do not trust a client payload like `{ totalScore: 100 }`. Instead, the client sends `{ questionId: 'x', selectedOption: 'y' }` and the server determines correctness.

## 5. Environment Security
- Never commit `.env` files.
- Restrict MongoDB Network Access to known IPs if possible.
- Rotate JWT secrets and database passwords periodically.

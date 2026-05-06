# Database Schema Planning

Using MongoDB with Mongoose ODM.

## 1. Users Collection
Stores user profiles, authentication, and subscription status.
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique, indexed)
- `passwordHash`: String (required for email/pwd auth)
- `googleId`: String (sparse, unique)
- `role`: Enum ['user', 'admin'] (default: 'user')
- `subscription`:
  - `plan`: Enum ['free', 'pro', 'business']
  - `status`: Enum ['active', 'cancelled', 'past_due']
  - `stripeCustomerId`: String
- `createdAt`: Date
- `updatedAt`: Date

## 2. Quizzes Collection
Stores the main configuration for a video quiz.
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User', indexed)
- `title`: String (required)
- `description`: String
- `videoUrl`: String (required)
- `youtubeVideoId`: String (required)
- `status`: Enum ['draft', 'published']
- `isPublic`: Boolean (default: true)
- `shareUrlSlug`: String (unique, indexed)
- `createdAt`: Date
- `updatedAt`: Date

## 3. Questions Collection
Stores individual questions linked to a specific quiz.
- `_id`: ObjectId
- `quizId`: ObjectId (ref: 'Quiz', indexed)
- `timestamp`: Number (seconds, required)
- `type`: Enum ['multiple_choice', 'true_false']
- `questionText`: String (required)
- `options`: Array of Objects
  - `id`: String
  - `text`: String
  - `isCorrect`: Boolean
- `order`: Number (for resolving questions at the same timestamp)

## 4. Sessions Collection
Tracks a viewer's session for analytics and preventing re-attempts (if enforced).
- `_id`: ObjectId
- `quizId`: ObjectId (ref: 'Quiz')
- `viewerId`: String (Anonymous UUID stored in local storage, or User ID)
- `ipAddress`: String (Hashed for privacy)
- `userAgent`: String
- `startedAt`: Date
- `completedAt`: Date
- `totalScore`: Number
- `watchPercentage`: Number

## 5. Attempts Collection
Stores individual answers given by a viewer.
- `_id`: ObjectId
- `sessionId`: ObjectId (ref: 'Session', indexed)
- `quizId`: ObjectId (ref: 'Quiz')
- `questionId`: ObjectId (ref: 'Question')
- `selectedOptionId`: String
- `isCorrect`: Boolean
- `timeTakenToAnswer`: Number (seconds)
- `createdAt`: Date

## 6. Indexing Strategy
- `Users`: `{ email: 1 }`
- `Quizzes`: `{ userId: 1, createdAt: -1 }`, `{ shareUrlSlug: 1 }`
- `Questions`: `{ quizId: 1, timestamp: 1 }`
- `Sessions`: `{ quizId: 1 }`
- `Attempts`: `{ sessionId: 1 }`

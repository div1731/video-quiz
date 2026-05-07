import express from 'express';
import * as quizController from '../controllers/quiz.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All quiz routes require authentication
router.use(protect);

router
  .route('/')
  .post(quizController.createQuiz)
  .get(quizController.getMyQuizzes);

router
  .route('/:id')
  .get(quizController.getQuiz)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

// Get quiz with all questions (used by the builder)
router.get('/:id/full', quizController.getQuizWithQuestions);

// Get analytics for a quiz
router.get('/:id/analytics', quizController.getQuizAnalytics);

// Question sub-routes
router.post('/:id/questions', quizController.addQuestion);
router
  .route('/:id/questions/:questionId')
  .put(quizController.updateQuestion)
  .delete(quizController.deleteQuestion);

export default router;

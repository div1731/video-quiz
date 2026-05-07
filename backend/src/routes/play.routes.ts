import express from 'express';
import * as playController from '../controllers/play.controller';

const router = express.Router();

// Public route to fetch quiz by slug
router.get('/:slug', playController.getPlayableQuiz);
router.post('/:slug/attempt', playController.submitAttempt);

export default router;

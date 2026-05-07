import express from 'express';
import * as playController from '../controllers/play.controller';

const router = express.Router();

// Public route to fetch quiz by slug
router.get('/:slug', playController.getPlayableQuiz);

export default router;

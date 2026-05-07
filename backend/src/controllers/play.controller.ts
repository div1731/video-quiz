import { Request, Response, NextFunction } from 'express';
import * as quizService from '../services/quiz.service';

export const getPlayableQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getQuizBySlugWithQuestions(req.params.slug as string);
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

export const submitAttempt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const attemptData = req.body;
    // Get the quiz by slug to find its ID
    const { quiz } = await quizService.getQuizBySlugWithQuestions(slug);
    
    // Create attempt
    const attempt = await quizService.submitAttempt(quiz._id.toString(), attemptData);
    res.status(201).json({ status: 'success', data: { attempt } });
  } catch (err) {
    next(err);
  }
};

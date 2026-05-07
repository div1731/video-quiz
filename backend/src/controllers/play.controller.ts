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

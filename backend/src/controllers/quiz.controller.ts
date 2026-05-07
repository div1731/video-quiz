import { Request, Response, NextFunction } from 'express';
import * as quizService from '../services/quiz.service';

// ─── Quiz Handlers ───────────────────────────────────────────

export const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const quiz = await quizService.createQuiz(userId, req.body);
    res.status(201).json({ status: 'success', data: { quiz } });
  } catch (err) {
    next(err);
  }
};

export const getMyQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const quizzes = await quizService.getUserQuizzes(userId);
    res.status(200).json({ status: 'success', results: quizzes.length, data: { quizzes } });
  } catch (err) {
    next(err);
  }
};

export const getQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const quiz = await quizService.getQuizById(req.params.id as string, userId);
    res.status(200).json({ status: 'success', data: { quiz } });
  } catch (err) {
    next(err);
  }
};

export const getQuizWithQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const data = await quizService.getQuizWithQuestions(req.params.id as string, userId);
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

export const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const quiz = await quizService.updateQuiz(req.params.id as string, userId, req.body);
    res.status(200).json({ status: 'success', data: { quiz } });
  } catch (err) {
    next(err);
  }
};

export const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    await quizService.deleteQuiz(req.params.id as string, userId);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

// ─── Question Handlers ───────────────────────────────────────

export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const question = await quizService.addQuestion(req.params.id as string, userId, req.body);
    res.status(201).json({ status: 'success', data: { question } });
  } catch (err) {
    next(err);
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const question = await quizService.updateQuestion(
      req.params.id as string,
      req.params.questionId as string,
      userId,
      req.body
    );
    res.status(200).json({ status: 'success', data: { question } });
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    await quizService.deleteQuestion(
      req.params.id as string,
      req.params.questionId as string,
      userId
    );
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

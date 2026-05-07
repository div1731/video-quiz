import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { Attempt } from '../models/attempt.model';
import { AppError } from '../utils/AppError';
import crypto from 'crypto';

// ─── Quiz CRUD ───────────────────────────────────────────────

export const createQuiz = async (userId: string, data: any) => {
  const youtubeUrlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = data.videoUrl?.match(youtubeUrlPattern);

  if (!match || !match[1]) {
    throw new AppError('Invalid YouTube URL provided', 400);
  }

  const youtubeVideoId = match[1];
  const shareUrlSlug = crypto.randomBytes(6).toString('hex');

  const quiz = await Quiz.create({
    ...data,
    userId,
    youtubeVideoId,
    shareUrlSlug,
  });

  return quiz;
};

export const getUserQuizzes = async (userId: string) => {
  return await Quiz.find({ userId }).sort({ createdAt: -1 });
};

export const getQuizById = async (quizId: string, userId: string) => {
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }
  return quiz;
};

export const getQuizWithQuestions = async (quizId: string, userId: string) => {
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }
  const questions = await Question.find({ quizId }).sort({ timestamp: 1, order: 1 });
  return { quiz, questions };
};

export const getQuizBySlugWithQuestions = async (slug: string) => {
  const quiz = await Quiz.findOne({ shareUrlSlug: slug, status: 'published' });
  if (!quiz) {
    throw new AppError('Quiz not found or is not published', 404);
  }
  const questions = await Question.find({ quizId: quiz._id }).sort({ timestamp: 1, order: 1 });
  return { quiz, questions };
};

export const updateQuiz = async (quizId: string, userId: string, data: any) => {
  const quiz = await Quiz.findOneAndUpdate(
    { _id: quizId, userId },
    data,
    { new: true, runValidators: true }
  );

  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }

  return quiz;
};

export const deleteQuiz = async (quizId: string, userId: string) => {
  const quiz = await Quiz.findOneAndDelete({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }
  // Also delete all associated questions
  await Question.deleteMany({ quizId });
  return quiz;
};

// ─── Question CRUD ───────────────────────────────────────────

export const addQuestion = async (quizId: string, userId: string, data: any) => {
  // Verify quiz ownership first
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }

  const question = await Question.create({
    ...data,
    quizId,
  });

  return question;
};

export const updateQuestion = async (quizId: string, questionId: string, userId: string, data: any) => {
  // Verify quiz ownership
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }

  const question = await Question.findOneAndUpdate(
    { _id: questionId, quizId },
    data,
    { new: true, runValidators: true }
  );

  if (!question) {
    throw new AppError('Question not found', 404);
  }

  return question;
};

export const deleteQuestion = async (quizId: string, questionId: string, userId: string) => {
  // Verify quiz ownership
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }

  const question = await Question.findOneAndDelete({ _id: questionId, quizId });
  if (!question) {
    throw new AppError('Question not found', 404);
  }

  return question;
};

export const getQuestionsByQuiz = async (quizId: string) => {
  return await Question.find({ quizId }).sort({ timestamp: 1, order: 1 });
};

// ─── Analytics ───────────────────────────────────────────────

export const submitAttempt = async (quizId: string, data: any) => {
  const attempt = await Attempt.create({
    ...data,
    quizId,
  });
  return attempt;
};

export const getQuizAnalytics = async (quizId: string, userId: string) => {
  // Verify quiz ownership
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError('Quiz not found or you do not have permission', 404);
  }

  const totalViews = await Attempt.countDocuments({ quizId });
  const completedAttempts = await Attempt.countDocuments({ quizId, completed: true });
  
  const completionRate = totalViews > 0 ? (completedAttempts / totalViews) * 100 : 0;

  // Aggregate for average score and watch time
  const stats = await Attempt.aggregate([
    { $match: { quizId: quiz._id } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$score' },
        avgWatchTime: { $avg: '$watchTime' },
      },
    },
  ]);

  const avgScore = stats.length > 0 ? stats[0].avgScore : 0;
  const avgWatchTime = stats.length > 0 ? stats[0].avgWatchTime : 0;

  // Get attempts for a time series chart (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyViews = await Attempt.aggregate([
    { 
      $match: { 
        quizId: quiz._id,
        createdAt: { $gte: thirtyDaysAgo }
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        views: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalViews,
    completionRate,
    avgScore,
    avgWatchTime,
    dailyViews,
  };
};

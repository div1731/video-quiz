import { create } from 'zustand';

export interface Question {
  _id: string;
  quizId: string;
  timestamp: number;
  type: string;
  questionText: string;
  options: {
    _id: string;
    text: string;
    isCorrect: boolean;
  }[];
  order: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  youtubeVideoId: string;
  status: string;
}

interface PlayerState {
  quiz: Quiz | null;
  questions: Question[];
  isPlaying: boolean;
  currentTime: number;
  score: number;
  currentQuestion: Question | null;
  answeredQuestions: Set<string>;
  isFinished: boolean;

  // Actions
  setQuizData: (quiz: Quiz, questions: Question[]) => void;
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  showQuestion: (question: Question) => void;
  answerQuestion: (questionId: string, isCorrect: boolean) => void;
  finishQuiz: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  quiz: null,
  questions: [],
  isPlaying: false,
  currentTime: 0,
  score: 0,
  currentQuestion: null,
  answeredQuestions: new Set<string>(),
  isFinished: false,

  setQuizData: (quiz, questions) => set({ quiz, questions }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setCurrentTime: (time) => set({ currentTime: time }),
  showQuestion: (question) => set({ currentQuestion: question, isPlaying: false }),
  answerQuestion: (questionId, isCorrect) => 
    set((state) => {
      const newAnswered = new Set(state.answeredQuestions);
      newAnswered.add(questionId);
      return {
        answeredQuestions: newAnswered,
        currentQuestion: null,
        isPlaying: true,
        score: isCorrect ? state.score + 1 : state.score,
      };
    }),
  finishQuiz: () => set({ isFinished: true, isPlaying: false }),
  reset: () => set({
    isPlaying: false,
    currentTime: 0,
    score: 0,
    currentQuestion: null,
    answeredQuestions: new Set<string>(),
    isFinished: false,
  }),
}));

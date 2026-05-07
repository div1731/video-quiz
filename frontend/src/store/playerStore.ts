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
  viewerId: string;
  sessionStartTime: number;
  slug: string;

  // Actions
  setQuizData: (slug: string, quiz: Quiz, questions: Question[], viewerId: string) => void;
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  showQuestion: (question: Question) => void;
  answerQuestion: (questionId: string, isCorrect: boolean) => void;
  finishQuiz: () => void;
  reset: () => void;
  submitAnalytics: (completed: boolean) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  quiz: null,
  questions: [],
  isPlaying: false,
  currentTime: 0,
  score: 0,
  currentQuestion: null,
  answeredQuestions: new Set<string>(),
  isFinished: false,
  viewerId: '',
  sessionStartTime: 0,
  slug: '',

  setQuizData: (slug, quiz, questions, viewerId) => set({ 
    slug, 
    quiz, 
    questions, 
    viewerId,
    sessionStartTime: Date.now() 
  }),
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
  finishQuiz: () => {
    set({ isFinished: true, isPlaying: false });
    get().submitAnalytics(true);
  },
  submitAnalytics: async (completed: boolean) => {
    const state = get();
    if (!state.slug || !state.viewerId) return;

    try {
      const watchTime = Math.floor((Date.now() - state.sessionStartTime) / 1000); // in seconds
      
      const payload = {
        viewerId: state.viewerId,
        watchTime,
        score: state.score,
        completed
      };

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      // Use dynamic import or standard fetch to avoid axios import issues if not explicitly added in this file
      await fetch(`${backendUrl}/api/play/${state.slug}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to submit analytics', err);
    }
  },
  reset: () => set({
    isPlaying: false,
    currentTime: 0,
    score: 0,
    currentQuestion: null,
    answeredQuestions: new Set<string>(),
    isFinished: false,
    sessionStartTime: Date.now(),
  }),
}));

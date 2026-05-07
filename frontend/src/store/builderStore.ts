import { create } from 'zustand';

interface QuestionOption {
  _id?: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  quizId: string;
  timestamp: number;
  type: 'multiple_choice' | 'true_false';
  questionText: string;
  options: QuestionOption[];
  order: number;
}

interface BuilderState {
  // Video state
  currentTime: number;
  duration: number;
  isPlaying: boolean;

  // Questions
  questions: Question[];

  // UI state
  editingQuestion: Question | null;
  showQuestionModal: boolean;

  // Actions
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, question: Question) => void;
  openQuestionModal: (question?: Question | null) => void;
  closeQuestionModal: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  questions: [],
  editingQuestion: null,
  showQuestionModal: false,

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setQuestions: (questions) => set({ questions }),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question].sort((a, b) => a.timestamp - b.timestamp),
    })),

  removeQuestion: (questionId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q._id !== questionId),
    })),

  updateQuestion: (questionId, question) =>
    set((state) => ({
      questions: state.questions
        .map((q) => (q._id === questionId ? question : q))
        .sort((a, b) => a.timestamp - b.timestamp),
    })),

  openQuestionModal: (question = null) =>
    set({ editingQuestion: question ?? null, showQuestionModal: true }),

  closeQuestionModal: () =>
    set({ editingQuestion: null, showQuestionModal: false }),
}));

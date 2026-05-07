'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useBuilderStore } from '@/store/builderStore';
import YouTubePlayer from '@/components/builder/YouTubePlayer';
import QuestionTimeline from '@/components/builder/QuestionTimeline';
import QuestionFormModal from '@/components/builder/QuestionFormModal';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

interface QuizData {
  _id: string;
  title: string;
  youtubeVideoId: string;
  status: string;
}

export default function QuizBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const {
    questions,
    showQuestionModal,
    setQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    closeQuestionModal,
  } = useBuilderStore();

  // Fetch quiz and its questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/quizzes/${quizId}/full`);
        setQuiz(response.data.data.quiz);
        setQuestions(response.data.data.questions);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, setQuestions]);

  // Save question (create or update)
  const handleSaveQuestion = useCallback(
    async (data: any) => {
      try {
        if (data._id) {
          // Update
          const response = await api.put(`/quizzes/${quizId}/questions/${data._id}`, data);
          updateQuestion(data._id, response.data.data.question);
        } else {
          // Create
          const response = await api.post(`/quizzes/${quizId}/questions`, data);
          addQuestion(response.data.data.question);
        }
        closeQuestionModal();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to save question');
      }
    },
    [quizId, addQuestion, updateQuestion, closeQuestionModal]
  );

  // Delete question
  const handleDeleteQuestion = useCallback(
    async (questionId: string) => {
      if (!confirm('Delete this question?')) return;
      try {
        await api.delete(`/quizzes/${quizId}/questions/${questionId}`);
        removeQuestion(questionId);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete question');
      }
    },
    [quizId, removeQuestion]
  );

  // Publish quiz
  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.put(`/quizzes/${quizId}`, { status: 'published' });
      setQuiz((prev) => (prev ? { ...prev, status: 'published' } : prev));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to publish quiz');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-red-400 mb-4">{error || 'Quiz not found'}</p>
        <Link href="/quizzes" className="text-indigo-400 hover:underline">
          ← Back to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            href="/quizzes"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{quiz.title}</h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {questions.length} question{questions.length !== 1 ? 's' : ''} · 
              <span className={quiz.status === 'published' ? ' text-emerald-400' : ' text-amber-400'}>
                {' '}{quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {quiz.status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={publishing || questions.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
            >
              <Eye className="w-4 h-4" />
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left – Video Player */}
        <div className="xl:col-span-3 space-y-4">
          <YouTubePlayer videoId={quiz.youtubeVideoId} />
        </div>

        {/* Right – Question Timeline */}
        <div className="xl:col-span-2">
          <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Question Timeline</h2>
            <QuestionTimeline onDeleteQuestion={handleDeleteQuestion} />
          </div>
        </div>
      </div>

      {/* Question Form Modal */}
      {showQuestionModal && (
        <QuestionFormModal
          quizId={quizId}
          onSave={handleSaveQuestion}
          onClose={closeQuestionModal}
        />
      )}
    </div>
  );
}

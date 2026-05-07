'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { VideoPlayer } from '../../../components/player/VideoPlayer';
import { usePlayerStore } from '../../../store/playerStore';

export default function PlayQuizPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { quiz, setQuizData, reset } = usePlayerStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // We use absolute URL or relative if frontend proxies it. Since we are in next client component,
        // we should probably use the backend URL from env or fallback to localhost.
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/api/play/${slug}`);
        
        const { quiz, questions } = response.data.data;
        reset();
        setQuizData(quiz, questions);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        setError(err.response?.data?.message || 'Failed to load quiz. It may not exist or is not published yet.');
        setLoading(false);
      }
    };

    if (slug) {
      fetchQuiz();
    }
  }, [slug, setQuizData, reset]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Interactive Video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 py-4 px-6 md:px-12 flex justify-between items-center shadow-md z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white truncate max-w-lg">
            {quiz?.title}
          </h1>
          <p className="text-gray-400 text-sm truncate max-w-lg">
            {quiz?.description}
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-gray-300 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-sm font-medium">Interactive Mode</span>
        </div>
      </header>

      {/* Main Content - Player */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-center">
          <VideoPlayer />
        </div>
      </main>
    </div>
  );
}

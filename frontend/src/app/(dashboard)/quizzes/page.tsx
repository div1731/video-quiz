'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Play, Settings2, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  status: string;
  createdAt: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes');
        setQuizzes(response.data.data.quizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Quizzes</h1>
          <p className="text-zinc-400 mt-1">Manage your interactive video quizzes</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="h-[400px] rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">No quizzes yet</h3>
          <p className="text-zinc-400 max-w-sm mt-2 mb-6">
            Create your first interactive video quiz to start engaging your audience.
          </p>
          <Link
            href="/quizzes/new"
            className="px-6 py-3 bg-white text-zinc-900 rounded-xl font-medium hover:bg-zinc-100 transition-colors"
          >
            Create New Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="aspect-video relative bg-zinc-950 overflow-hidden">
                {/* Fallback image if thumbnail fails, but typically we'd use YouTube's thumbnail URL */}
                <img
                  src={`https://img.youtube.com/vi/${quiz.youtubeVideoId}/maxresdefault.jpg`}
                  alt={quiz.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${quiz.youtubeVideoId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${quiz.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                    {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 line-clamp-1">{quiz.title}</h3>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {quiz.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <div className="flex gap-2">
                    <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Edit Quiz">
                      <Settings2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

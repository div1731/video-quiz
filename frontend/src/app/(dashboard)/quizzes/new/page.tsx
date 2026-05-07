'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ArrowLeft, Video } from 'lucide-react';
import Link from 'next/link';

export default function NewQuizPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const router = useRouter();

  const extractYouTubeId = (url: string) => {
    const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match?.[1] || null;
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setPreviewId(extractYouTubeId(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/quizzes', { title, description, videoUrl });
      const quizId = response.data.data.quiz._id;
      router.push(`/quizzes/${quizId}/edit`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link
          href="/quizzes"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Quiz</h1>
          <p className="text-zinc-400 mt-1">Paste a YouTube URL and give your quiz a title</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg">
            {error}
          </div>
        )}

        {/* Video URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">YouTube Video URL</label>
          <input
            type="url"
            required
            value={videoUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Video Preview */}
        {previewId && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-black">
            <img
              src={`https://img.youtube.com/vi/${previewId}/maxresdefault.jpg`}
              alt="Video preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${previewId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Video className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Quiz Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., JavaScript Basics — Chapter 1"
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Description <span className="text-zinc-500">(optional)</span></label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what this quiz covers..."
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/quizzes"
            className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !previewId}
            className="px-6 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            {loading ? 'Creating...' : 'Continue to Builder →'}
          </button>
        </div>
      </form>
    </div>
  );
}

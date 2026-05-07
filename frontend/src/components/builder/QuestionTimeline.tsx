'use client';

import React from 'react';
import { useBuilderStore, Question } from '@/store/builderStore';
import { CirclePlus, Edit3, Trash2, Clock } from 'lucide-react';

interface QuestionTimelineProps {
  onDeleteQuestion: (questionId: string) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function QuestionTimeline({ onDeleteQuestion }: QuestionTimelineProps) {
  const { questions, duration, currentTime, openQuestionModal } = useBuilderStore();

  const handleAddAtCurrentTime = () => {
    openQuestionModal(null);
  };

  return (
    <div className="space-y-4">
      {/* Timeline bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative h-10 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          {/* Progress indicator */}
          {duration > 0 && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-20 transition-all duration-200"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          )}

          {/* Question markers */}
          {questions.map((q) => (
            <button
              key={q._id}
              onClick={() => openQuestionModal(q)}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full border-2 border-zinc-900 z-10 hover:scale-150 transition-transform cursor-pointer"
              style={{
                left: duration > 0 ? `${(q.timestamp / duration) * 100}%` : '0%',
              }}
              title={`${formatTime(q.timestamp)} — ${q.questionText}`}
            />
          ))}
        </div>
      </div>

      {/* Add Question Button */}
      <button
        onClick={handleAddAtCurrentTime}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-400 hover:text-indigo-400 rounded-xl transition-all duration-300 hover:bg-indigo-500/5"
      >
        <CirclePlus className="w-5 h-5" />
        Add Question at {formatTime(currentTime)}
      </button>

      {/* Question List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No questions added yet. Play the video and click "Add Question" at the desired timestamp.
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q._id}
              className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">{formatTime(q.timestamp)}</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-wider">
                      {q.type === 'multiple_choice' ? 'MCQ' : 'T/F'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 font-medium line-clamp-2">{q.questionText}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {q.options.map((opt, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          opt.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {opt.text}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openQuestionModal(q)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => q._id && onDeleteQuestion(q._id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useBuilderStore, Question } from '@/store/builderStore';
import { X, Plus, Trash2 } from 'lucide-react';

interface QuestionFormModalProps {
  quizId: string;
  onSave: (data: any) => void;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function QuestionFormModal({ quizId, onSave, onClose }: QuestionFormModalProps) {
  const { editingQuestion, currentTime } = useBuilderStore();

  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState<'multiple_choice' | 'true_false'>('multiple_choice');
  const [timestamp, setTimestamp] = useState(0);
  const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.questionText);
      setType(editingQuestion.type);
      setTimestamp(editingQuestion.timestamp);
      setOptions(
        editingQuestion.options.map((o) => ({
          text: o.text,
          isCorrect: o.isCorrect,
        }))
      );
    } else {
      setTimestamp(Math.floor(currentTime));
    }
  }, [editingQuestion, currentTime]);

  const handleTypeChange = (newType: 'multiple_choice' | 'true_false') => {
    setType(newType);
    if (newType === 'true_false') {
      setOptions([
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: false },
      ]);
    } else if (options.length < 2) {
      setOptions([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const setCorrectOption = (index: number) => {
    setOptions(options.map((opt, i) => ({ ...opt, isCorrect: i === index })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data: any = {
      questionText,
      type,
      timestamp,
      options,
      order: 0,
    };

    if (editingQuestion?._id) {
      data._id = editingQuestion._id;
    }

    await onSave(data);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editingQuestion ? 'Edit Question' : 'Add Question'}
            </h2>
            <p className="text-sm text-zinc-400 mt-0.5">
              at <span className="font-mono text-indigo-400">{formatTime(timestamp)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Question Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('multiple_choice')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                  type === 'multiple_choice'
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('true_false')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                  type === 'true_false'
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                True / False
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Timestamp (seconds)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={timestamp}
              onChange={(e) => setTimestamp(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Question</label>
            <textarea
              required
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Options <span className="text-zinc-500">(click radio to mark correct)</span>
              </label>
              {type === 'multiple_choice' && options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              )}
            </div>

            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOption(idx)}
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                    opt.isCorrect
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {opt.isCorrect && (
                    <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="text"
                  required
                  disabled={type === 'true_false'}
                  value={opt.text}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[idx] = { ...newOpts[idx]!, text: e.target.value };
                    setOptions(newOpts);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 px-3 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {type === 'multiple_choice' && options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

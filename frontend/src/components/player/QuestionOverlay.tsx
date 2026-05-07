'use client';

import React, { useState } from 'react';
import { usePlayerStore, Question } from '../../store/playerStore';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionOverlayProps {
  question: Question;
}

export const QuestionOverlay: React.FC<QuestionOverlayProps> = ({ question }) => {
  const answerQuestion = usePlayerStore((state) => state.answerQuestion);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionClick = (optionId: string, correct: boolean) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
    setIsCorrect(correct);
    setShowFeedback(true);

    // After a brief delay to show feedback, resume video
    setTimeout(() => {
      answerQuestion(question._id, correct);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.questionText}</h2>
        
        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option._id;
            
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ";
            
            if (!showFeedback) {
              buttonClass += "border-gray-200 hover:border-blue-500 hover:bg-blue-50";
            } else {
              if (option.isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-700";
              } else if (isSelected && !option.isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                buttonClass += "border-gray-200 opacity-50";
              }
            }

            return (
              <button
                key={option._id}
                onClick={() => handleOptionClick(option._id, option.isCorrect)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <span className="font-medium text-lg">{option.text}</span>
                {showFeedback && option.isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
                {showFeedback && isSelected && !option.isCorrect && (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold text-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'Correct! Resuming video...' : 'Incorrect! Resuming video...'}
          </div>
        )}
      </div>
    </div>
  );
};

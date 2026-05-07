'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { usePlayerStore } from '../../store/playerStore';
import { QuestionOverlay } from './QuestionOverlay';

export const VideoPlayer: React.FC = () => {
  const { 
    quiz, 
    questions, 
    isPlaying, 
    play, 
    pause, 
    setCurrentTime, 
    showQuestion, 
    currentQuestion,
    answeredQuestions,
    finishQuiz,
    isFinished,
    score
  } = usePlayerStore();
  
  const playerRef = useRef<ReactPlayer>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);

    // Check if any question needs to be shown
    const upcomingQuestion = questions.find(q => {
      // Show question if we passed its timestamp (with 1s tolerance)
      // and it hasn't been answered yet
      return state.playedSeconds >= q.timestamp && 
             state.playedSeconds <= q.timestamp + 1 && 
             !answeredQuestions.has(q._id);
    });

    if (upcomingQuestion && !currentQuestion) {
      pause();
      showQuestion(upcomingQuestion);
      // Seek exactly to the question timestamp to ensure precision
      playerRef.current?.seekTo(upcomingQuestion.timestamp, 'seconds');
    }
  };

  const handleEnded = () => {
    finishQuiz();
  };

  if (!quiz) return null;

  // Render nothing until mounted on client to prevent hydration errors with ReactPlayer
  if (!mounted) return <div className="aspect-video bg-gray-900 rounded-2xl animate-pulse" />;

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
      <ReactPlayer
        ref={playerRef}
        url={quiz.videoUrl}
        playing={isPlaying && !currentQuestion && !isFinished}
        onProgress={handleProgress}
        onPlay={play}
        onPause={pause}
        onEnded={handleEnded}
        controls={!currentQuestion && !isFinished} // Disable controls when question is showing
        width="100%"
        height="100%"
        progressInterval={500}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            }
          }
        }}
      />
      
      {currentQuestion && (
        <QuestionOverlay question={currentQuestion} />
      )}

      {isFinished && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 text-white p-6">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full text-center border border-gray-700 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <div className="text-6xl font-black text-blue-500 mb-6">
              {score} / {questions.length}
            </div>
            <p className="text-xl text-gray-300 mb-8">
              {score === questions.length ? 'Perfect score! Excellent job.' : 
               score >= questions.length / 2 ? 'Good effort! You got most of them right.' : 
               'Keep practicing! Review the material and try again.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

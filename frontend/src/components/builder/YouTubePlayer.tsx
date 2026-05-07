'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useBuilderStore } from '@/store/builderStore';

// Declare the YT type on window
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setCurrentTime, setDuration, setIsPlaying } = useBuilderStore();

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 250);
  }, [setCurrentTime]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startPolling();
            } else {
              setIsPlaying(false);
              stopPolling();
              if (playerRef.current) {
                setCurrentTime(playerRef.current.getCurrentTime());
              }
            }
          },
        },
      });
    };

    // Load YouTube IFrame API if not already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      stopPolling();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId, setCurrentTime, setDuration, setIsPlaying, startPolling, stopPolling]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Video } from 'lucide-react';

export default function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 h-16 flex items-center px-4 justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center">
          <Video className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">VidQuiz</span>
      </Link>
      <button className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}

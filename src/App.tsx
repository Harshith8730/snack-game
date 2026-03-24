/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-pink-500/30 flex flex-col relative overflow-hidden">
      {/* Background Neon Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-green-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full py-6 px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">Neon</span>
          <span className="text-zinc-100 mx-2">&</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">Beats</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Left/Top: Game */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
          <MusicPlayer />
        </div>

      </main>
    </div>
  );
}

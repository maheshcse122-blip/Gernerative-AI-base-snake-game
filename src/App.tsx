import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { NeonBackground } from './components/NeonBackground';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  return (
    <div className="h-screen w-full flex flex-col bg-black text-[#00ffff] font-mono selection:bg-[#ff00ff] overflow-hidden relative crt-overlay">
      <div className="noise-bg" />
      <NeonBackground />
      
      {/* HEADER: DATA UPLINK STATUS */}
      <header className="h-20 border-b-4 border-[#00ffff] flex items-center justify-between px-10 bg-black shrink-0 z-10 relative glitch-art">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute -top-3 left-0 w-8 h-2 bg-[#ff00ff] glitch-art" />
            <div className="w-6 h-6 bg-[#00ffff] animate-ping" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[#00ffff] uppercase font-pixel jarring-text-magenta">
            SYNTH_SNAKE <span className="text-[10px] font-normal opacity-100 lowercase tracking-normal font-mono bg-[#ff00ff] text-black px-2 ml-4">TERMINAL_ACTIVE</span>
          </h1>
        </div>
        
        <div className="flex gap-16">
          <div className="flex flex-col items-start jarring-border bg-black p-2">
            <span className="text-[10px] uppercase text-[#ff00ff] tracking-widest font-pixel mb-1">RAW_FEED_01</span>
            <span className="text-3xl font-black leading-none font-pixel">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="flex flex-col items-start jarring-border bg-black p-2">
            <span className="text-[10px] uppercase text-[#ff00ff] tracking-widest font-pixel mb-1">UPLINK_PEAK</span>
            <span className="text-3xl font-black leading-none font-pixel">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* CORE_PROCESSOR */}
      <main className="flex-1 flex min-h-0 relative m-6 border-4 border-[#ff00ff] bg-black glitch-art">
        <MusicPlayer onScoreChange={setScore} onHighScoreChange={setHighScore} />
        
        {/* SIDEBAR: SYSTEM_LOGS */}
        <aside className="w-16 border-l-4 border-[#00ffff] bg-black flex flex-col items-center py-8 space-y-12 shrink-0 relative overflow-hidden">
          <div className="writing-mode-vertical-rl rotate-180 text-[10px] uppercase tracking-[8px] text-[#ff00ff] whitespace-nowrap font-pixel">
            SUBSYSTEM_MONITOR
          </div>
          <div className="flex-1 flex flex-col justify-end pb-8 space-y-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="w-2 h-2 bg-[#00ffff] animate-pulse" />
            ))}
          </div>
          <div className="absolute bottom-4 w-full text-center text-[8px] font-pixel opacity-50">
            ERR_404
          </div>
        </aside>
      </main>

      {/* STATUS_BAR */}
      <footer className="h-8 bg-[#ff00ff] text-black px-10 flex items-center justify-between text-[10px] font-pixel z-20">
        <div className="flex items-center gap-8">
          <span>MEM_ALLOC: 4096KB</span>
          <span>FPS: 60.00</span>
          <span>LINK: ENCRYPTED</span>
        </div>
        <div className="animate-pulse">
          SYSTEM_STABLE: OK
        </div>
      </footer>
    </div>
  );
}

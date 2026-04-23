import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';
import { SONGS, THEME } from '../constants';
import { SnakeGame } from './SnakeGame';

interface MusicPlayerProps {
  onScoreChange?: (score: number) => void;
  onHighScoreChange?: (highScore: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onScoreChange, onHighScoreChange }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      if (!isNaN(audioRef.current.duration)) {
        setDuration(formatTime(audioRef.current.duration));
      }
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* FEED_SIDEBAR: AUDIO_VECTORS */}
      <aside className="w-80 border-r-4 border-[#00ffff] bg-black flex flex-col shrink-0 relative overflow-hidden group">
        <div className="h-14 border-b-4 border-[#00ffff] flex items-center px-6 bg-[#ff00ff] text-black">
          <span className="text-xs font-black uppercase tracking-tighter font-pixel">AUDIO_VECTORS</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {SONGS.map((song, index) => (
            <motion.div
              key={song.id}
              whileHover={{ x: 5 }}
              onClick={() => {
                 setCurrentSongIndex(index);
                 setIsPlaying(true);
              }}
              className={`p-4 cursor-pointer transition-all border-2 ${
                currentSongIndex === index 
                  ? 'bg-[#00ffff] text-black border-white' 
                  : 'bg-black text-[#00ffff] border-[#00ffff]/30 hover:border-[#ff00ff]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-pixel">ID_{song.id.padStart(2, '0')}</span>
                <span className="text-[10px] font-pixel opacity-70">03:45</span>
              </div>
              <div className="text-[11px] font-black uppercase truncate mb-1 font-pixel">{song.title}</div>
              <div className="text-[9px] opacity-60 uppercase truncate font-pixel">SRC: {song.artist}</div>
              
              {currentSongIndex === index && isPlaying && (
                <div className="mt-4 flex gap-1 items-end h-4">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 8, 12, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-black"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-auto p-6 border-t-4 border-[#00ffff] bg-black">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-[#ff00ff] uppercase font-pixel tracking-widest">WAVE_OUT</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-[#00ffff] animate-pulse" />)}
            </div>
          </div>
          <div className="h-12 w-full bg-black border-2 border-[#00ffff] relative overflow-hidden glitch-art">
             <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#00ffff_2px,#00ffff_4px)]" />
             <div className="h-full w-2 bg-[#ff00ff] absolute left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </aside>

      {/* CORE_PROCESSOR: GAME_RUNNER */}
      <section className="flex-1 bg-black relative flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden relative flex items-center justify-center">
           <SnakeGame onScoreChange={onScoreChange} onHighScoreChange={onHighScoreChange} />
        </div>

        {/* DATA_FOOTER: PLAYER_CONTROL */}
        <footer className="h-24 bg-black border-t-4 border-[#ff00ff] px-10 flex items-center justify-between z-20 glitch-art">
          {/* SOURCE_ID */}
          <div className="flex items-center gap-6 w-1/4">
            <div className="w-14 h-14 bg-black border-2 border-[#00ffff] flex items-center justify-center overflow-hidden shrink-0 jarring-border">
               <motion.img 
                  src={currentSong.cover} 
                  className={`w-full h-full object-cover grayscale brightness-150 ${isPlaying ? 'animate-pulse' : ''}`}
                  referrerPolicy="no-referrer"
               />
            </div>
            <div className="truncate">
              <div className="text-[12px] font-black text-[#00ffff] uppercase truncate font-pixel mb-1">{currentSong.title}</div>
              <div className="text-[9px] text-[#ff00ff] uppercase truncate font-pixel">STATUS: STREAM_ACTIVE</div>
            </div>
          </div>

          {/* VEC_CMD */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
            <div className="flex items-center gap-12">
              <button 
                onClick={handlePrev}
                className="text-[#00ffff] hover:text-[#ff00ff] transition-all"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-14 h-14 bg-[#00ffff] border-4 border-white flex items-center justify-center text-black hover:bg-[#ff00ff] transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-1" />}
              </button>
              <button 
                onClick={handleNext}
                className="text-[#00ffff] hover:text-[#ff00ff] transition-all"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>
            
            <div className="w-full flex items-center gap-4 mt-2">
              <span className="text-[10px] text-[#00ffff] font-pixel min-w-[40px]">{currentTime}</span>
              <div className="flex-1 h-2 bg-black border-2 border-[#00ffff] relative group/progress cursor-pointer">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-[#ff00ff]" 
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-[#00ffff] font-pixel min-w-[40px]">{duration}</span>
            </div>
          </div>

          {/* AUX_CMD */}
          <div className="w-1/4 flex justify-end items-center gap-10">
             <div className="hidden lg:flex items-center gap-4">
               <Volume2 className="w-5 h-5 text-[#ff00ff]" />
               <div className="w-24 h-2 bg-black border-2 border-[#ff00ff]">
                 <div className="h-full bg-[#ff00ff] w-[80%]"></div>
               </div>
             </div>
             <button className="px-6 py-2 border-2 border-[#00ffff] text-[10px] uppercase text-[#00ffff] font-pixel hover:bg-[#00ffff] hover:text-black transition-all">
               FULL_SCN
             </button>
          </div>
        </footer>
      </section>
    </>
  );
};

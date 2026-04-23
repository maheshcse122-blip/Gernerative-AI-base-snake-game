import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';
import { Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED, THEME } from '../constants';

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
  onHighScoreChange?: (highScore: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onHighScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score]);

  useEffect(() => {
    onHighScoreChange?.(highScore);
  }, [highScore]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case ' ':
          if (!isGameOver) setIsPaused(prev => !prev);
          else resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case Direction.UP: newHead.y -= 1; break;
          case Direction.DOWN: newHead.y += 1; break;
          case Direction.LEFT: newHead.x -= 1; break;
          case Direction.RIGHT: newHead.x += 1; break;
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [direction, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = THEME.bgBoard;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = THEME.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((p, i) => {
      ctx.fillStyle = THEME.accent;
      ctx.shadowBlur = i === 0 ? 15 : 0;
      ctx.shadowColor = THEME.accent;
      
      const x = p.x * cellSize + 1;
      const y = p.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.fillRect(x, y, size, size);
      
      // Snake head accent
      if (i === 0) {
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 4, y + 4, size - 8, size - 8);
      }
    });

    // Draw food
    ctx.fillStyle = THEME.secondary;
    ctx.shadowBlur = 15;
    ctx.shadowColor = THEME.secondary;
    ctx.fillRect(
      food.x * cellSize + 4,
      food.y * cellSize + 4,
      cellSize - 8,
      cellSize - 8
    );

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center justify-center relative bg-black p-4">
      <div className="relative group jarring-border">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          id="game-canvas"
          className="bg-black glitch-art"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-none p-12 z-50 overflow-hidden"
            >
              <div className="bg-[#ff00ff] text-black w-full py-6 flex items-center justify-center mb-8 glitch-art">
                <h2 className="text-4xl font-black uppercase tracking-tight font-pixel">
                  {isGameOver ? 'TERMINAL_CRASH' : 'CORE_HALTED'}
                </h2>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#00ffff', color: '#000000' }}
                whileTap={{ scale: 0.9 }}
                onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                className="group relative px-12 py-4 border-4 border-[#00ffff] text-[#00ffff] font-black uppercase tracking-widest font-pixel transition-all bg-black"
              >
                {isGameOver ? 'REBOOT_LINK' : 'RESUME_UPLINK'}
              </motion.button>
              
              <p className="mt-12 text-[#ff00ff] text-[10px] uppercase font-pixel animate-pulse">
                SYS_MSG: PRESS SPACE TO OVERRIDE
              </p>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff] glitch-art" />
              <div className="absolute bottom-0 right-0 w-full h-1 bg-[#ff00ff] glitch-art" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SYSTEM_INPUT_GUIDE */}
      <div className="mt-8 flex gap-12 text-[#ff00ff] font-pixel text-[10px]">
        <div className="flex items-center gap-4">
          <kbd className="px-2 py-1 bg-[#00ffff] text-black font-bold border-2 border-white">WASD</kbd>
          <span className="uppercase">VEC_INPUT</span>
        </div>
        <div className="flex items-center gap-4">
          <kbd className="px-2 py-1 bg-[#00ffff] text-black font-bold border-2 border-white">SPACE</kbd>
          <span className="uppercase">KILL_PROC</span>
        </div>
      </div>
    </div>
  );
};

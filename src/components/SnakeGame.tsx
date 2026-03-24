import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (isGameOver) {
      if (e.key === 'Enter' || e.key === ' ') resetGame();
      return;
    }

    if (e.key === ' ') {
      setIsPaused((prev) => !prev);
      return;
    }

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="text-green-400 font-mono text-xl tracking-widest drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-pink-500 font-mono text-xl tracking-widest drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
          HIGH: {highScore.toString().padStart(4, '0')}
        </div>
      </div>

      <div className="relative bg-zinc-950 border-2 border-green-500/50 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.15)] overflow-hidden p-1">
        {/* Grid Background */}
        <div 
          className="grid gap-[1px] bg-zinc-900/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 500px)',
            height: 'min(90vw, 500px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`
                  w-full h-full rounded-sm transition-all duration-75
                  ${isSnakeHead ? 'bg-green-400 shadow-[0_0_10px_#4ade80] z-10' : ''}
                  ${isSnakeBody ? 'bg-green-500/80 shadow-[0_0_5px_#22c55e]' : ''}
                  ${isFood ? 'bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse' : ''}
                  ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-zinc-900/30' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-black text-red-500 mb-2 tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">GAME OVER</h2>
            <p className="text-zinc-300 mb-6 font-mono">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-full transition-all shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_25px_rgba(74,222,128,0.8)] transform hover:scale-105"
            >
              PLAY AGAIN
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-20">
            <h2 className="text-3xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse">PAUSED</h2>
          </div>
        )}
      </div>

      <div className="mt-6 text-zinc-500 font-mono text-sm text-center">
        <p>Use <span className="text-zinc-300">WASD</span> or <span className="text-zinc-300">Arrow Keys</span> to move</p>
        <p>Press <span className="text-zinc-300">Space</span> to pause</p>
      </div>
    </div>
  );
}

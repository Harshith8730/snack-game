import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Cybernetic Pulse',
    artist: 'AI Generator Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Neon Overdrive',
    artist: 'AI Generator Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Synthwave Dreams',
    artist: 'AI Generator Gamma',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-cyan-400 font-bold text-xl tracking-wider shadow-cyan-400/50 drop-shadow-md">{currentTrack.title}</h3>
          <p className="text-zinc-400 text-sm mt-1">{currentTrack.artist}</p>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <button 
            onClick={handlePrev}
            className="text-zinc-400 hover:text-pink-500 transition-colors drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="bg-pink-500 hover:bg-pink-400 text-zinc-950 rounded-full p-4 transition-all shadow-[0_0_15px_rgba(236,72,153,0.6)] hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] transform hover:scale-105"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-zinc-400 hover:text-pink-500 transition-colors drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full mt-4 px-4">
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-400 hover:text-cyan-400 transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import type { Mood } from "@/data/moods";

interface MiniPlayerProps {
  mood: Mood;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const timerPresets = [5, 10, 15, 30, 60, 120];

// Panel compacto por sonido: botón play/pause, slider de volumen y timer.
const MiniPlayer: React.FC<MiniPlayerProps> = ({ mood }) => {
  const { toggleTrack, tracks, setTrackVolume, timer, startTimer, stopTimer } = useAudioPlayer();
  const track = tracks.find((t) => t.track.id === mood.slug);
  const isPlaying = !!track?.isPlaying;
  const volume = track?.volume ?? 0.8;
  const Icon = mood.icon;
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto mt-6">
      <div className="flex items-center justify-between bg-[#1f1f1f]/80 backdrop-blur-sm border border-[#333] px-4 sm:px-5 py-3 rounded-full shadow-md w-full hover:bg-[#2a2a2a] transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-neutral-200" />
          <span className="text-base sm:text-lg font-medium text-neutral-100 tracking-wide">
            {mood.title}
          </span>
        </div>

        <button
          onClick={() => toggleTrack({ id: mood.slug, url: mood.url, defaultVolume: mood.defaultVolume })}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
          className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full transition-all duration-300 ${
            isPlaying
              ? "bg-neutral-100 hover:bg-white"
              : "bg-[#333] hover:bg-[#444]"
          }`}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 sm:w-5 h-4 sm:h-5 text-[#121212]">
              <path d="M9 19V5m6 14V5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 sm:w-5 h-4 sm:h-5 text-white">
              <path d="M5 3.868a1 1 0 0 1 1.514-.857l12 8.132a1 1 0 0 1 0 1.714l-12 8.132A1 1 0 0 1 5 20.132V3.868Z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 px-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-500 shrink-0">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setTrackVolume(mood.slug, Number(e.target.value))}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-[#333] accent-neutral-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
      </div>

      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => setShowTimer(!showTimer)}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
          </svg>
          Temporizador
        </button>

        {timer && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">{formatTime(timer.remaining)}</span>
            <button
              onClick={stopTimer}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {showTimer && !timer && (
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {timerPresets.map((min) => (
            <button
              key={min}
              onClick={() => { startTimer(min); setShowTimer(false); }}
              className="text-xs px-3 py-1.5 rounded-full bg-[#1f1f1f] border border-[#333] text-neutral-300 hover:bg-[#2a2a2a] hover:text-white transition-all"
            >
              {min < 60 ? `${min} min` : `${min / 60} h`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MiniPlayer;

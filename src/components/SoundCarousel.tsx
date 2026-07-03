"use client";

import React, { useState } from "react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import type { Mood } from "@/data/moods";

interface SoundCarouselProps {
  moods: Mood[];
  onActiveChange: (slug: string) => void;
}

// Carrusel de iconos con spotlight: muestra 3 elementos (izquierdo, centro, derecho)
// y resalta el del centro. El usuario navega clickeando los laterales.
const SoundCarousel: React.FC<SoundCarouselProps> = ({ moods, onActiveChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { tracks } = useAudioPlayer();

  const goTo = (index: number) => {
    setActiveIndex(index);
    onActiveChange(moods[index].slug);
  };

  const prev = (activeIndex - 1 + moods.length) % moods.length;
  const next = (activeIndex + 1) % moods.length;

  const isPlaying = (index: number) =>
    !!tracks.find(t => t.track.id === moods[index].slug)?.isPlaying;

  return (
    <div className="relative flex items-center justify-center w-full h-44 sm:h-52 overflow-hidden select-none">
      <RoundButton
        mood={moods[prev]}
        isPlaying={isPlaying(prev)}
        onClick={() => goTo(prev)}
        className="absolute left-[10%] sm:left-[18%] scale-75 opacity-60 hover:opacity-90"
      />

      <RoundButton
        mood={moods[activeIndex]}
        isPlaying={isPlaying(activeIndex)}
        onClick={() => goTo(activeIndex)}
        className="z-10 scale-105 sm:scale-110"
        active
      />

      <RoundButton
        mood={moods[next]}
        isPlaying={isPlaying(next)}
        onClick={() => goTo(next)}
        className="absolute right-[10%] sm:right-[18%] scale-75 opacity-60 hover:opacity-90"
      />
    </div>
  );
};

const RoundButton: React.FC<{
  mood: Mood;
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
  active?: boolean;
}> = ({ mood, isPlaying, onClick, className, active }) => {
  const Icon = mood.icon;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full transition-all duration-500 ${
        active
          ? "bg-[#333] shadow-lg p-6 sm:p-8 hover:scale-115"
          : ""
      } ${isPlaying && active ? "ring-2 ring-white/40 ring-offset-2 ring-offset-[#121212]" : ""} ${className || ""}`}
    >
      <Icon
        className={`transition-colors duration-300 ${
          active
            ? "w-10 h-10 sm:w-14 sm:h-14"
            : "w-8 h-8 sm:w-10 sm:h-10"
        } text-white`}
      />
    </button>
  );
};

export default SoundCarousel;

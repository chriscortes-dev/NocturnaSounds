"use client";

import React from "react";

interface MiniPlayerProps {
  title: string;
  Icon: React.ElementType;
  isPlaying: boolean;
  onToggle: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  title,
  Icon,
  isPlaying,
  onToggle,
}) => {
  return (
    <div
      className="flex items-center justify-between bg-[#1f1f1f]/80 backdrop-blur-sm border border-[#333] px-4 sm:px-5 py-3 rounded-full shadow-md w-full mt-6 hover:bg-[#2a2a2a]"
    >
      {/* Icono + título */}
      <div className="flex items-center gap-3">
        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-neutral-200" />
        <span className="text-base sm:text-lg font-medium text-neutral-100 tracking-wide">
          {title}
        </span>
      </div>

      {/* Botón Play / Pause */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // evita que el click active la navegación al click del MiniPlayer
          onToggle();          // llama a la función que viene del HomePage
        }}
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
        className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-[#333] hover:bg-[#444] transition-all duration-300 focus:outline-none"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 sm:w-5 h-4 sm:h-5 text-white"
          >
            <path d="M9 19V5m6 14V5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 sm:w-5 h-4 sm:h-5 text-white"
          >
            <path d="M5 3.868a1 1 0 0 1 1.514-.857l12 8.132a1 1 0 0 1 0 1.714l-12 8.132A1 1 0 0 1 5 20.132V3.868Z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MiniPlayer;

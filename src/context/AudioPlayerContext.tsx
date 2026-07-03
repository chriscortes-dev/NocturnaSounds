"use client";

import React, { createContext, useContext } from "react";
import { useWebAudioPlayer } from "@/hooks/useWebAudioPlayer";
import {
  type Track,
  type TrackState,
  type TimerState,
} from "@/hooks/useWebAudioPlayer";

// Expone el hook useWebAudioPlayer a través de Context para que cualquier
// componente pueda acceder al estado global de reproducción.
interface AudioPlayerContextValue {
  toggleTrack: (track: Track) => void;
  tracks: TrackState[];
  masterVolume: number;
  setMasterVolume: (vol: number) => void;
  setTrackVolume: (trackId: string, vol: number) => void;
  timer: TimerState | null;
  startTimer: (minutes: number) => void;
  stopTimer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    toggleTrack, tracks,
    masterVolume, setMasterVolume,
    setTrackVolume,
    timer, startTimer, stopTimer,
  } = useWebAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={{
      toggleTrack, tracks,
      masterVolume, setMasterVolume,
      setTrackVolume,
      timer, startTimer, stopTimer,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
};

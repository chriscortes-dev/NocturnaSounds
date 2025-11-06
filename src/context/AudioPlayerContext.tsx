"use client";

import React, { createContext, useContext } from "react";
import { useWebAudioPlayer } from "@/hooks/useWebAudioPlayer";

interface Track {
  id: string;
  url: string;
}

interface TrackState {
  track: Track;
  gainNode: GainNode;
  sourceNode: AudioBufferSourceNode;
  audioBuffer: AudioBuffer;
  isPlaying: boolean;
}

interface AudioPlayerContextValue {
  toggleTrack: (track: Track) => void;
  tracks: TrackState[];
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toggleTrack, tracks } = useWebAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={{ toggleTrack, tracks }}>
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

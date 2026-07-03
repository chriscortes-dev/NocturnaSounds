import { useRef, useState, useCallback, useEffect } from 'react';

export interface Track {
  id: string;
  url: string;
  defaultVolume?: number;
}

export interface TrackState {
  track: Track;
  gainNode: GainNode;
  sourceNode: AudioBufferSourceNode;
  audioBuffer: AudioBuffer;
  isPlaying: boolean;
  volume: number;
}

export interface TimerState {
  duration: number;
  remaining: number;
}

// Motor de audio principal — Web Audio API multi-track con loop, fade y master volume
export const useWebAudioPlayer = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [tracks, setTracks] = useState<TrackState[]>([]);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const [masterVolume, setMasterVolumeState] = useState(0.8);
  const [timer, setTimer] = useState<TimerState | null>(null);

  const ensureContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = masterVolume;
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    return audioCtxRef.current;
  };

  const applyMicroFade = (audioBuffer: AudioBuffer, fadeTime = 0.01) => {
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const samples = audioBuffer.getChannelData(channel);
      const fadeSamples = Math.floor(fadeTime * audioBuffer.sampleRate);
      for (let i = 0; i < fadeSamples; i++) samples[i] *= i / fadeSamples;
      for (let i = 0; i < fadeSamples; i++) {
        const idx = samples.length - i - 1;
        samples[idx] *= i / fadeSamples;
      }
    }
  };

  const setMasterVolume = useCallback((vol: number) => {
    setMasterVolumeState(vol);
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(vol, audioCtxRef.current!.currentTime, 0.1);
    }
  }, []);

  const setTrackVolume = useCallback((trackId: string, vol: number) => {
    setTracks(prev => {
      const track = prev.find(t => t.track.id === trackId);
      if (track && audioCtxRef.current) {
        track.gainNode.gain.setTargetAtTime(vol, audioCtxRef.current.currentTime, 0.1);
      }
      return prev.map(t =>
        t.track.id === trackId ? { ...t, volume: vol } : t
      );
    });
  }, []);

  const playTrack = async (track: Track) => {
    const audioCtx = ensureContext();
    const masterGain = masterGainRef.current!;

    const existing = tracks.find(t => t.track.id === track.id);
    if (existing && !existing.isPlaying) {
      const newSource = audioCtx.createBufferSource();
      newSource.buffer = existing.audioBuffer;
      newSource.loop = true;
      newSource.loopStart = 0;
      newSource.loopEnd = existing.audioBuffer.duration;
      newSource.connect(existing.gainNode);

      const startTime = audioCtx.currentTime + 0.05;
      existing.gainNode.gain.setValueAtTime(0, startTime);
      existing.gainNode.gain.linearRampToValueAtTime(existing.volume, startTime + 2);
      newSource.start(startTime);

      setTracks(prev =>
        prev.map(t =>
          t.track.id === track.id ? { ...t, sourceNode: newSource, isPlaying: true } : t
        )
      );
      return;
    }

    const response = await fetch(track.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    applyMicroFade(audioBuffer);

    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true;
    sourceNode.loopStart = 0;
    sourceNode.loopEnd = audioBuffer.duration;

    const gainNode = audioCtx.createGain();
    const initialVol = track.defaultVolume ?? 0.8;
    const startTime = audioCtx.currentTime + 0.05;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(initialVol, startTime + 2);

    sourceNode.connect(gainNode).connect(masterGain);
    sourceNode.start(startTime);

    setTracks(prev => [...prev, {
      track,
      gainNode,
      sourceNode,
      audioBuffer,
      isPlaying: true,
      volume: initialVol,
    }]);
  };

  const stopTrack = useCallback((id: string) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const trackState = tracksRef.current.find(t => t.track.id === id);
    if (!trackState) return;

    const stopTime = audioCtx.currentTime + 2;
    trackState.gainNode.gain.linearRampToValueAtTime(0, stopTime);
    trackState.sourceNode.stop(stopTime);

    setTimeout(() => {
      trackState.sourceNode.disconnect();
      trackState.gainNode.disconnect();
    }, 2100);

    setTracks(prev => prev.filter(t => t.track.id !== id));
  }, []);

  const toggleTrack = (track: Track) => {
    const trackState = tracks.find(t => t.track.id === track.id);
    if (trackState?.isPlaying) stopTrack(track.id);
    else playTrack(track);
  };

  const stopAllTracks = useCallback(() => {
    tracksRef.current.forEach(t => stopTrack(t.track.id));
  }, [stopTrack]);

  const startTimer = useCallback((minutes: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const duration = minutes * 60;
    const endTime = Date.now() + duration * 1000;

    setTimer({ duration, remaining: duration });

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setTimer(prev => prev ? { ...prev, remaining } : null);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimer(null);
        stopAllTracks();
      }
    }, 1000);
  }, [stopAllTracks]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(null);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return {
    tracks, playTrack, stopTrack, toggleTrack,
    masterVolume, setMasterVolume,
    setTrackVolume,
    stopAllTracks,
    timer, startTimer, stopTimer,
  };
};

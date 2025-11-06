import { useRef, useState } from 'react';

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

export const useWebAudioPlayer = (initialTempo = 120) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [tracks, setTracks] = useState<TrackState[]>([]);
  const [tempo, setTempo] = useState(initialTempo);

  const applyMicroFade = (audioBuffer: AudioBuffer, fadeTime = 0.01) => {
    // fadeTime en segundos
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const samples = audioBuffer.getChannelData(channel);
      const fadeSamples = Math.floor(fadeTime * audioBuffer.sampleRate);

      // fade in
      for (let i = 0; i < fadeSamples; i++) {
        samples[i] *= i / fadeSamples;
      }

      // fade out
      for (let i = 0; i < fadeSamples; i++) {
        const idx = samples.length - i - 1;
        samples[idx] *= i / fadeSamples;
      }
    }
  };

  const playTrack = async (track: Track) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const audioCtx = audioCtxRef.current;

    const existing = tracks.find(t => t.track.id === track.id);
    if (existing && !existing.isPlaying) {
      const newSource = audioCtx.createBufferSource();
      newSource.buffer = existing.audioBuffer;
      newSource.loop = true;
      newSource.loopStart = 0;
      newSource.loopEnd = existing.audioBuffer.duration;

      newSource.connect(existing.gainNode);
      const startTime = audioCtx.currentTime + 0.05; // leve delay para seguridad
      existing.gainNode.gain.setValueAtTime(0, startTime);
      existing.gainNode.gain.linearRampToValueAtTime(1, startTime + 2);

      newSource.start(startTime);

      setTracks(prev =>
        prev.map(t =>
          t.track.id === track.id
            ? { ...t, sourceNode: newSource, isPlaying: true }
            : t
        )
      );
      return;
    }

    // cargar audio
    const response = await fetch(track.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // aplicar microfade para evitar clicks
    applyMicroFade(audioBuffer);

    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true;
    sourceNode.loopStart = 0;
    sourceNode.loopEnd = audioBuffer.duration;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    sourceNode.connect(gainNode).connect(audioCtx.destination);

    const startTime = audioCtx.currentTime + 0.05;
    sourceNode.start(startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + 2);

    const newTrack: TrackState = {
      track,
      gainNode,
      sourceNode,
      audioBuffer,
      isPlaying: true,
    };

    setTracks(prev => [...prev, newTrack]);
  };

  const stopTrack = (id: string) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const trackState = tracks.find(t => t.track.id === id);
    if (!trackState) return;

    const stopTime = audioCtx.currentTime + 2;
    trackState.gainNode.gain.linearRampToValueAtTime(0, stopTime);
    trackState.sourceNode.stop(stopTime);

    setTimeout(() => {
      trackState.sourceNode.disconnect();
      trackState.gainNode.disconnect();
    }, 2100);

    setTracks(prev => prev.filter(t => t.track.id !== id));
  };

  const toggleTrack = (track: Track) => {
    const trackState = tracks.find(t => t.track.id === track.id);
    if (trackState?.isPlaying) stopTrack(track.id);
    else playTrack(track);
  };

  return { tracks, playTrack, stopTrack, toggleTrack, tempo, setTempo };
};

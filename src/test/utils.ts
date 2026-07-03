import { vi } from "vitest";

export interface MockGainNode {
  gain: {
    value: number;
    setTargetAtTime: ReturnType<typeof vi.fn>;
    setValueAtTime: ReturnType<typeof vi.fn>;
    linearRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

export interface MockAudioBufferSourceNode {
  buffer: AudioBuffer | null;
  loop: boolean;
  loopStart: number;
  loopEnd: number;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

export interface MockAudioContext {
  currentTime: number;
  destination: object;
  createGain: ReturnType<typeof vi.fn>;
  createBufferSource: ReturnType<typeof vi.fn>;
  decodeAudioData: ReturnType<typeof vi.fn>;
}

export function createMockAudioContext() {
  const gainNodes: MockGainNode[] = [];
  const sourceNodes: MockAudioBufferSourceNode[] = [];

  const ctx: MockAudioContext = {
    currentTime: 0,
    destination: { toString: () => "[object AudioDestinationNode]" },
    createGain: vi.fn(() => {
      const node: MockGainNode = {
        gain: {
          value: 1,
          setTargetAtTime: vi.fn(),
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn().mockReturnThis(),
        disconnect: vi.fn(),
      };
      gainNodes.push(node);
      return node;
    }),
    createBufferSource: vi.fn(() => {
      const source: MockAudioBufferSourceNode = {
        buffer: null,
        loop: false,
        loopStart: 0,
        loopEnd: 0,
        start: vi.fn(),
        stop: vi.fn(),
        connect: vi.fn().mockReturnThis(),
        disconnect: vi.fn(),
      };
      sourceNodes.push(source);
      return source;
    }),
    decodeAudioData: vi.fn().mockResolvedValue(createMockAudioBuffer(2, 44100, 5)),
  };

  return { ctx, gainNodes, sourceNodes };
}

export function createMockAudioBuffer(
  channels: number,
  sampleRate: number,
  durationSec: number,
) {
  const length = Math.floor(sampleRate * durationSec);
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < channels; ch++) {
    channelData.push(new Float32Array(length));
  }
  return {
    duration: durationSec,
    numberOfChannels: channels,
    sampleRate,
    getChannelData: vi.fn((ch: number) => channelData[ch] ?? new Float32Array(length)),
  } as unknown as AudioBuffer;
}

export function mockGlobalAudio() {
  const mock = createMockAudioContext();
  vi.stubGlobal("AudioContext", vi.fn(function () { return mock.ctx; }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  }));
  return mock;
}

export function restoreGlobalAudio() {
  vi.unstubAllGlobals();
}

export function createMockTrack(
  id = "lluvia",
  url = "/audio/lluvia.mp3",
  defaultVolume = 0.8,
): import("@/hooks/useWebAudioPlayer").Track {
  return { id, url, defaultVolume };
}

import { moods } from "@/data/moods";

export function createMockMood(slug = "lluvia") {
  return moods.find((m) => m.slug === slug) ?? moods[0];
}

import { renderHook, act } from "@testing-library/react";
import { useWebAudioPlayer } from "@/hooks/useWebAudioPlayer";
import { createMockAudioContext, createMockTrack } from "@/test/utils";

describe("useWebAudioPlayer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("playTrack", () => {
    it("creates AudioContext on first play and fetches audio", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      await act(async () => { await result.current.playTrack(createMockTrack()); });

      expect(result.current.tracks).toHaveLength(1);
      expect(result.current.tracks[0].audioBuffer).toBeDefined();

      vi.unstubAllGlobals();
    });

    it("adds more than one track for multi-track support", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      await act(async () => { await result.current.playTrack(createMockTrack("lluvia")); });
      await act(async () => { await result.current.playTrack(createMockTrack("viento")); });

      expect(result.current.tracks).toHaveLength(2);

      vi.unstubAllGlobals();
    });

    it("applies fade-in ramp on new track", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      const track = createMockTrack();
      await act(async () => { await result.current.playTrack(track); });

      expect(result.current.tracks[0].isPlaying).toBe(true);
      expect(result.current.tracks[0].volume).toBe(track.defaultVolume);

      vi.unstubAllGlobals();
    });
  });

  describe("toggleTrack", () => {
    it("plays a stopped track", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      const track = createMockTrack();
      await act(async () => { await result.current.toggleTrack(track); });

      expect(result.current.tracks).toHaveLength(1);
      expect(result.current.tracks[0].isPlaying).toBe(true);

      vi.unstubAllGlobals();
    });

    it("stops a playing track", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      const track = createMockTrack();
      await act(async () => { await result.current.toggleTrack(track); });
      act(() => { result.current.toggleTrack(track); });

      expect(result.current.tracks).toHaveLength(0);

      vi.unstubAllGlobals();
    });
  });

  describe("stopTrack", () => {
    it("fades out and removes track from state", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      const track = createMockTrack();
      await act(async () => { await result.current.playTrack(track); });

      act(() => { result.current.stopTrack(track.id); });

      expect(result.current.tracks).toHaveLength(0);

      vi.unstubAllGlobals();
    });

    it("does nothing if AudioContext does not exist", () => {
      const { result } = renderHook(() => useWebAudioPlayer());
      act(() => { result.current.stopTrack("nonexistent"); });
      expect(result.current.tracks).toHaveLength(0);
    });
  });

  describe("volume control", () => {
    it("setMasterVolume updates state", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      await act(async () => { await result.current.playTrack(createMockTrack()); });

      act(() => { result.current.setMasterVolume(0.5); });

      expect(result.current.masterVolume).toBe(0.5);

      vi.unstubAllGlobals();
    });

    it("setTrackVolume updates specific track", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      const track = createMockTrack();
      await act(async () => { await result.current.playTrack(track); });

      act(() => { result.current.setTrackVolume(track.id, 0.3); });

      expect(result.current.tracks[0].volume).toBe(0.3);

      vi.unstubAllGlobals();
    });
  });

  describe("stopAllTracks", () => {
    it("stops all active tracks", async () => {
      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      await act(async () => { await result.current.playTrack(createMockTrack("lluvia")); });
      await act(async () => { await result.current.playTrack(createMockTrack("viento")); });

      act(() => { result.current.stopAllTracks(); });

      expect(result.current.tracks).toHaveLength(0);

      vi.unstubAllGlobals();
    });
  });

  describe("timer", () => {
    it("starts countdown and tracks remaining time", () => {
      vi.useFakeTimers();

      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      act(() => { result.current.startTimer(1); });

      expect(result.current.timer!.duration).toBe(60);
      expect(result.current.timer!.remaining).toBe(60);

      act(() => { vi.advanceTimersByTime(5000); });
      expect(result.current.timer!.remaining).toBe(55);

      vi.unstubAllGlobals();
    });

    it("stops all tracks when timer reaches 0", async () => {
      vi.useFakeTimers();

      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      await act(async () => { await result.current.playTrack(createMockTrack()); });
      expect(result.current.tracks).toHaveLength(1);

      act(() => { result.current.startTimer(1); });
      act(() => { vi.advanceTimersByTime(61000); });

      expect(result.current.timer).toBeNull();
      expect(result.current.tracks).toHaveLength(0);

      vi.unstubAllGlobals();
    });

    it("can be cancelled with stopTimer", () => {
      vi.useFakeTimers();

      const audioMock = createMockAudioContext();
      vi.stubGlobal("AudioContext", function () { return audioMock.ctx; });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)) }));

      const { result } = renderHook(() => useWebAudioPlayer());
      act(() => { result.current.startTimer(5); });
      expect(result.current.timer).not.toBeNull();

      act(() => { result.current.stopTimer(); });
      expect(result.current.timer).toBeNull();

      vi.unstubAllGlobals();
    });
  });
});

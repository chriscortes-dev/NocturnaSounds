import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MiniPlayer from "@/components/MiniPlayer";
import { createMockMood } from "@/test/utils";
import { type TrackState, type TimerState } from "@/hooks/useWebAudioPlayer";

const mockToggleTrack = vi.fn();
const mockSetTrackVolume = vi.fn();
const mockStartTimer = vi.fn();
const mockStopTimer = vi.fn();

vi.mock("@/context/AudioPlayerContext", () => ({
  useAudioPlayer: vi.fn(),
}));

import { useAudioPlayer } from "@/context/AudioPlayerContext";

function setupMocks(overrides: Partial<ReturnType<typeof useAudioPlayer>> = {}) {
  const defaults: ReturnType<typeof useAudioPlayer> = {
    toggleTrack: mockToggleTrack,
    tracks: [],
    masterVolume: 0.8,
    setMasterVolume: vi.fn(),
    setTrackVolume: mockSetTrackVolume,
    timer: null,
    startTimer: mockStartTimer,
    stopTimer: mockStopTimer,
  };
  (useAudioPlayer as ReturnType<typeof vi.fn>).mockReturnValue({
    ...defaults,
    ...overrides,
  });
}

describe("MiniPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the mood title and icon", () => {
    setupMocks();
    const mood = createMockMood("lluvia");
    render(<MiniPlayer mood={mood} />);

    expect(screen.getByText("Lluvia")).toBeInTheDocument();
  });

  it("shows play button when track is not playing", () => {
    setupMocks();
    const mood = createMockMood("lluvia");
    render(<MiniPlayer mood={mood} />);

    const playBtn = screen.getByLabelText("Reproducir");
    expect(playBtn).toBeInTheDocument();
  });

  it("shows pause button when track is playing", () => {
    const mockTrack = {
      track: { id: "lluvia", url: "/audio/lluvia.mp3", defaultVolume: 0.8 },
      isPlaying: true,
      volume: 0.8,
    } as TrackState;
    setupMocks({ tracks: [mockTrack] });
    const mood = createMockMood("lluvia");
    render(<MiniPlayer mood={mood} />);

    expect(screen.getByLabelText("Pausar")).toBeInTheDocument();
  });

  it("calls toggleTrack on play button click", async () => {
    setupMocks();
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    await userEvent.click(screen.getByLabelText("Reproducir"));
    expect(mockToggleTrack).toHaveBeenCalledWith({
      id: mood.slug,
      url: mood.url,
      defaultVolume: mood.defaultVolume,
    });
  });

  it("renders volume slider at correct value", () => {
    const mockTrack = {
      track: { id: "lluvia", url: "/audio/lluvia.mp3", defaultVolume: 0.8 },
      isPlaying: true,
      volume: 0.5,
    } as TrackState;
    setupMocks({ tracks: [mockTrack] });
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("0.5");
  });

  it("calls setTrackVolume on slider change", () => {
    const mockTrack = {
      track: { id: "lluvia", url: "/audio/lluvia.mp3", defaultVolume: 0.8 },
      isPlaying: true,
      volume: 0.8,
    } as TrackState;
    setupMocks({ tracks: [mockTrack] });
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "0.3" } });
    expect(mockSetTrackVolume).toHaveBeenCalledWith("lluvia", 0.3);
  });

  it("shows timer button and presets on click", async () => {
    setupMocks();
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    const timerBtn = screen.getByText("Temporizador");
    await userEvent.click(timerBtn);

    expect(screen.getByText("5 min")).toBeInTheDocument();
    expect(screen.getByText("10 min")).toBeInTheDocument();
    expect(screen.getByText("15 min")).toBeInTheDocument();
    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(screen.getByText("1 h")).toBeInTheDocument();
    expect(screen.getByText("2 h")).toBeInTheDocument();
  });

  it("calls startTimer when preset is selected", async () => {
    setupMocks();
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    await userEvent.click(screen.getByText("Temporizador"));
    await userEvent.click(screen.getByText("5 min"));

    expect(mockStartTimer).toHaveBeenCalledWith(5);
  });

  it("shows remaining time and cancel when timer is active", () => {
    const timer: TimerState = { duration: 300, remaining: 120 };
    setupMocks({ timer });
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    expect(screen.getByText("02:00")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("calls stopTimer on cancel click", async () => {
    const timer: TimerState = { duration: 300, remaining: 120 };
    setupMocks({ timer });
    const mood = createMockMood();
    render(<MiniPlayer mood={mood} />);

    await userEvent.click(screen.getByText("Cancelar"));
    expect(mockStopTimer).toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SoundCarousel from "@/components/SoundCarousel";
import { moods } from "@/data/moods";
import { type TrackState } from "@/hooks/useWebAudioPlayer";

const mockOnActiveChange = vi.fn();

vi.mock("@/context/AudioPlayerContext", () => ({
  useAudioPlayer: vi.fn(),
}));

import { useAudioPlayer } from "@/context/AudioPlayerContext";

function setupMocks(overrides: Partial<ReturnType<typeof useAudioPlayer>> = {}) {
  const defaults: ReturnType<typeof useAudioPlayer> = {
    toggleTrack: vi.fn(),
    tracks: [],
    masterVolume: 0.8,
    setMasterVolume: vi.fn(),
    setTrackVolume: vi.fn(),
    timer: null,
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
  };
  (useAudioPlayer as ReturnType<typeof vi.fn>).mockReturnValue({
    ...defaults,
    ...overrides,
  });
}

describe("SoundCarousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders three mood buttons", () => {
    setupMocks();
    render(<SoundCarousel moods={moods} onActiveChange={mockOnActiveChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("renders the active mood as the center button", () => {
    setupMocks();
    render(<SoundCarousel moods={moods} onActiveChange={mockOnActiveChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toBeInTheDocument();
  });

  it("calls onActiveChange when clicking a side button", async () => {
    setupMocks();
    render(<SoundCarousel moods={moods} onActiveChange={mockOnActiveChange} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);

    expect(mockOnActiveChange).toHaveBeenCalled();
  });

  it("shows playing indicator on active track", () => {
    const activeMood = moods[0];
    const mockTrack = {
      track: { id: activeMood.slug, url: activeMood.url, defaultVolume: activeMood.defaultVolume },
      isPlaying: true,
      volume: 0.8,
    } as TrackState;
    setupMocks({ tracks: [mockTrack] });
    render(<SoundCarousel moods={moods} onActiveChange={mockOnActiveChange} />);

    const buttons = screen.getAllByRole("button");
    const activeBtn = buttons[1];
    expect(activeBtn.className).toContain("ring-2");
  });
});

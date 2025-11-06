import * as Icons from '../components/icons';

const baseUrl = "https://wulalluzuoaoppcuczej.supabase.co/storage/v1/object/public";

export const moods = [
  {
    slug: "lluvia",
    title: "Lluvia",
    icon: Icons.Rainy,
    url: `${baseUrl}/audio/rain.wav`,
    video: `${baseUrl}/videos/rain.mp4`,
  },
  {
    slug: "fogata",
    title: "Fogata",
    icon: Icons.Fireplace,
    url: `${baseUrl}/audio/fireplace.wav`,
    video: `${baseUrl}/videos/fireplace.mp4`,
  },
  {
    slug: "tormenta",
    title: "Tormenta",
    icon: Icons.Bolt,
    url: `${baseUrl}/audio/deep-thunder.wav`,
    video: `${baseUrl}/videos/storm.mp4`,
  },
  {
    slug: "viento",
    title: "Viento",
    icon: Icons.Wind,
    url: `${baseUrl}/audio/winter-wind.wav`,
    video: `${baseUrl}/videos/wind.mp4`,
  },
  {
    slug: "oceano",
    title: "Oceano",
    icon: Icons.Wave,
    url: `${baseUrl}/audio/ocean-waves.mp3`,
    video: `${baseUrl}/videos/ocean.mp4`,
  },
  {
    slug: "rio",
    title: "Rio",
    icon: Icons.Water,
    url: `${baseUrl}/audio/river-flow.mp3`,
    video: `${baseUrl}/videos/river.mp4`,
  },
];
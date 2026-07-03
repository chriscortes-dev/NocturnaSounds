import * as Icons from '../components/icons';

export interface Mood {
  slug: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  defaultVolume: number; // volumen inicial del track (0-1)
}

// Fuente única de datos. Define los 6 sonidos ambientales disponibles.
// Cada mood tiene un slug único, título, icono SVG, archivo de audio local
// y un volumen por defecto balanceado respecto a los demás.
export const moods: Mood[] = [
  {
    slug: "lluvia",
    title: "Lluvia",
    icon: Icons.Rainy,
    url: "/audio/lluvia.mp3",
    defaultVolume: 0.8,
  },
  {
    slug: "fogata",
    title: "Fogata",
    icon: Icons.Fireplace,
    url: "/audio/fogata.mp3",
    defaultVolume: 0.6,
  },
  {
    slug: "trueno",
    title: "Trueno",
    icon: Icons.Bolt,
    url: "/audio/trueno.wav",
    defaultVolume: 0.6,
  },
  {
    slug: "viento",
    title: "Viento",
    icon: Icons.Wind,
    url: "/audio/viento.wav",
    defaultVolume: 0.8,
  },
  {
    slug: "oceano",
    title: "Oceano",
    icon: Icons.Wave,
    url: "/audio/oceano.wav",
    defaultVolume: 0.9,
  },
  {
    slug: "rio",
    title: "Rio",
    icon: Icons.Water,
    url: "/audio/rio.wav",
    defaultVolume: 0.9,
  },
];

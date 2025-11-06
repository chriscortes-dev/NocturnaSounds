"use client";

import { useRouter, useParams } from "next/navigation";
import { moods } from "@/data/moods";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import MiniPlayer from "@/components/MiniPlayer";
import { Moon } from "@/components/icons";

export default function ScenePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const scene = moods.find((m) => m.slug === slug);
  const { toggleTrack, tracks } = useAudioPlayer();

  if (!scene)
    return <div className="text-center mt-10 text-neutral-300">Escena no encontrada.</div>;

  const currentTrack = tracks.find((t) => t.track.id === scene.slug);
  const isPlaying = !!currentTrack?.isPlaying;

  const handleToggle = () => {
    if (!scene.url) return;
    toggleTrack({ id: scene.slug, url: scene.url });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        src={scene.video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4">
        {/* Flecha atrás */}
        <button
          onClick={() => router.back()}
          aria-label="Volver"
          className="absolute top-5 left-5 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Contenido principal */}
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">{scene.title}</h1>

        <div className="w-full max-w-sm cursor-pointer">
          <MiniPlayer
            title={scene.title}
            Icon={scene.icon || Moon}
            isPlaying={isPlaying}
            onToggle={handleToggle}
          />
        </div>
      </div>
    </div>
  );
}

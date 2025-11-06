"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonCarousel from "@/components/ButtonCarousel";
import MiniPlayer from "@/components/MiniPlayer";
import { moods } from "@/data/moods";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useUI } from "@/context/UIContext";
import { Moon } from "@/components/icons";

export default function HomePage() {
  const router = useRouter();
  const { toggleTrack, tracks } = useAudioPlayer();
  const { selectedMood, setSelectedMood } = useUI();

  // Si no hay seleccionado aún, usar el primero
  useEffect(() => {
    if (!selectedMood && moods.length > 0) {
      setSelectedMood(moods[0].slug);
    }
  }, [selectedMood, setSelectedMood]);

  const handleButtonClick = (item: { slug: string }) => {
    setSelectedMood(item.slug);
  };

  const handleToggle = () => {
    if (!selectedMood) return;
    const mood = moods.find((m) => m.slug === selectedMood);
    if (mood?.url) toggleTrack({ id: mood.slug, url: mood.url });
  };

  const currentTrack = tracks.find((t) => t.track.id === selectedMood);
  const isPlaying = !!currentTrack?.isPlaying;
  const currentMood = moods.find((m) => m.slug === selectedMood);

  const buttons = moods.map((mood) => ({
    slug: mood.slug,
    icon: mood.icon,
  }));

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center px-4 sm:px-6 py-10">
      {/* Título */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-100 leading-snug mb-6">
        Explora, combina y deja que el sonido te guíe.
      </h1>

      {/* Carrusel */}
      <div className="w-full flex justify-center mb-8 overflow-hidden">
        <ButtonCarousel
          buttons={buttons}
          onPressButton={handleButtonClick}
          activeSlug={selectedMood}
        />
      </div>

      {/* MiniPlayer */}
      <div
        onClick={() => currentMood && router.push(`/scene/${currentMood.slug}`)}
        className="w-full max-w-sm cursor-pointer"
      >
        <MiniPlayer
          title={currentMood?.title || "Selecciona un mood"}
          Icon={currentMood?.icon || Moon}
          isPlaying={isPlaying}
          onToggle={handleToggle}
        />
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import SoundCarousel from "@/components/SoundCarousel";
import MiniPlayer from "@/components/MiniPlayer";
import { moods } from "@/data/moods";

// Página principal: carrusel de sonidos + reproductor del mood activo.
// Cada sonido se puede reproducir individualmente con su volumen y timer.
export default function HomePage() {
  const [activeSlug, setActiveSlug] = useState(moods[0].slug);
  const activeMood = moods.find((m) => m.slug === activeSlug) || moods[0];

  return (
    <section className="flex flex-col items-center w-full mx-auto px-4 py-6 sm:py-10">
      <div className="w-full max-w-lg mt-2">
        <SoundCarousel moods={moods} onActiveChange={setActiveSlug} />
        <MiniPlayer mood={activeMood} />
      </div>
    </section>
  );
}

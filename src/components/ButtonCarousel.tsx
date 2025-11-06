"use client";

import React, { useEffect, useState } from "react";

type ButtonItem = {
  slug: string;
  icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
};

type ButtonCarouselProps = {
  buttons: ButtonItem[];
  onPressButton: (item: ButtonItem) => void;
  activeSlug?: string; // 👈 nuevo prop opcional
};

export default function SpotlightCarousel({
  buttons,
  onPressButton,
  activeSlug,
}: ButtonCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔁 Sincroniza con el estado global si cambia el mood seleccionado
  useEffect(() => {
    if (activeSlug) {
      const foundIndex = buttons.findIndex((b) => b.slug === activeSlug);
      if (foundIndex !== -1) setActiveIndex(foundIndex);
    }
  }, [activeSlug, buttons]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onPressButton(buttons[index]);
  };

  const getVisibleButtons = () => {
    const leftIndex = (activeIndex - 1 + buttons.length) % buttons.length;
    const rightIndex = (activeIndex + 1) % buttons.length;
    return {
      left: buttons[leftIndex],
      center: buttons[activeIndex],
      right: buttons[rightIndex],
    };
  };

  const { left, center, right } = getVisibleButtons();

  return (
    <div className="relative flex items-center justify-center w-full h-48 overflow-hidden select-none">
      {/* Botón izquierdo (preview) */}
      <button
        onClick={() => handleClick((activeIndex - 1 + buttons.length) % buttons.length)}
        className="absolute left-[15%] scale-75 opacity-60 hover:opacity-80 transition-all duration-500"
      >
        <left.icon width={42} height={42} className="text-neutral-300 sm:w-12 sm:h-12" />
      </button>

      {/* Botón central (activo) */}
      <button
        onClick={() => handleClick(activeIndex)}
        className="z-10 flex items-center justify-center bg-[#333] rounded-full shadow-lg
                   p-5 sm:p-6 md:p-7 lg:p-8 scale-105 sm:scale-110 hover:scale-115
                   transition-all duration-500"
      >
        <center.icon
          width={48}
          height={48}
          className="text-white sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14"
        />
      </button>

      {/* Botón derecho (preview) */}
      <button
        onClick={() => handleClick((activeIndex + 1) % buttons.length)}
        className="absolute right-[15%] scale-75 opacity-60 hover:opacity-80 transition-all duration-500"
      >
        <right.icon width={42} height={42} className="text-neutral-300 sm:w-12 sm:h-12" />
      </button>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState } from "react";

type UIContextType = {
  selectedMood: string;
  setSelectedMood: (slug: string) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMood, setSelectedMood] = useState<string>(""); // inicia vacío

  return (
    <UIContext.Provider value={{ selectedMood, setSelectedMood }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI debe usarse dentro de un UIProvider");
  }
  return context;
};

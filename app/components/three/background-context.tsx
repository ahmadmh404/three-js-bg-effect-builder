"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BackgroundEffectType } from "@/components/three/background-effects";

interface BackgroundContextType {
  effectType: BackgroundEffectType;
  setEffectType: (type: BackgroundEffectType) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  currentPreset: string;
  setCurrentPreset: (preset: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [effectType, setEffectType] = useState<BackgroundEffectType>("auto");
  const [showControls, setShowControls] = useState(true);
  const [currentPreset, setCurrentPreset] = useState("default");

  return (
    <BackgroundContext.Provider
      value={{
        effectType,
        setEffectType,
        showControls,
        setShowControls,
        currentPreset,
        setCurrentPreset,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}

"use client";

import { BackgroundProvider } from "@/components/three/background-context";
import { BackgroundEffects } from "@/components/three/background-effects";
import { BackgroundSettings } from "@/components/three/background-settings";
import Image from "next/image";

export default function Home() {
  return (
    <BackgroundProvider>
      <div className="min-h-screen">
        {/* Background Effects */}
        <BackgroundEffects effectType="particles" showControls={false} />

        {/* Background Settings Panel */}
        {/* <BackgroundSettings /> */}
      </div>
    </BackgroundProvider>
  );
}

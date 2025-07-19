"use client";

import { useEffect, useState } from "react";
import { StarfieldBackground } from "@/components/three/starfield-background";
import { ParticleSystem } from "./particle-system";
import { defaultStarConfig } from "./star-effects-builder";

export type BackgroundEffectType = "starfield" | "particles" | "auto";

interface BackgroundEffectsProps {
  effectType?: BackgroundEffectType;
  showControls?: boolean;
}

export function BackgroundEffects({
  effectType = "auto",
  showControls = true,
}: BackgroundEffectsProps) {
  const [activeEffect, setActiveEffect] = useState<"starfield" | "particles">(
    "starfield"
  );
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    hasWebGL: true,
    isLowEnd: false,
  });

  useEffect(() => {
    // Check device capabilities
    const checkCapabilities = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const hasWebGL = (() => {
        try {
          const canvas = document.createElement("canvas");
          return !!(window.WebGLRenderingContext && canvas.getContext("webgl"));
        } catch (e) {
          return false;
        }
      })();

      const isLowEnd =
        !!navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

      setDeviceCapabilities({ isMobile, hasWebGL, isLowEnd });

      // Auto-select effect based on capabilities
      if (effectType === "auto") {
        if (!hasWebGL || isLowEnd) {
          setActiveEffect("particles");
        } else {
          setActiveEffect("starfield");
        }
      } else if (effectType === "starfield" && hasWebGL) {
        setActiveEffect("starfield");
      } else {
        setActiveEffect("particles");
      }
    };

    checkCapabilities();
  }, [effectType]);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Auto-switch to particles if FPS drops too low
        if (fps < 30 && activeEffect === "starfield" && effectType === "auto") {
          console.log("Switching to particles due to low FPS:", fps);
          setActiveEffect("particles");
        }
      }

      requestAnimationFrame(measureFPS);
    };

    if (effectType === "auto") {
      measureFPS();
    }
  }, [activeEffect, effectType]);

  return (
    <>
      {activeEffect === "starfield" ? (
        <StarfieldBackground
          showControls={showControls}
          starsPreset="aurora"
          starsConfig={defaultStarConfig}
        />
      ) : (
        <ParticleSystem />
      )}

      {/* Effect switcher for development/testing */}
      {/* {showControls && process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm border rounded-lg p-2">
          <div className="text-xs text-muted-foreground mb-2">
            Background Effect:
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveEffect("starfield")}
              className={`px-2 py-1 text-xs rounded ${
                activeEffect === "starfield"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
              disabled={!deviceCapabilities.hasWebGL}
            >
              Starfield
            </button>
            <button
              onClick={() => setActiveEffect("particles")}
              className={`px-2 py-1 text-xs rounded ${
                activeEffect === "particles"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Particles
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            WebGL: {deviceCapabilities.hasWebGL ? "✓" : "✗"} | Mobile:{" "}
            {deviceCapabilities.isMobile ? "✓" : "✗"} | Low-end:{" "}
            {deviceCapabilities.isLowEnd ? "✓" : "✗"}
          </div>
        </div>
      )} */}
    </>
  );
}

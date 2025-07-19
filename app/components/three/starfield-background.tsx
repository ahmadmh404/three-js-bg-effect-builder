"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  StarEffectsBuilder,
  defaultStarConfig,
  starPresets,
} from "@/components/three/star-effects-builder";
import { StarEffectsPanel } from "@/components/three/star-effect-panel";
import type {
  PresetType,
  StarConfig,
} from "@/components/three/star-effects-builder";

interface StarfieldBackgroundProps {
  starsConfig?: StarConfig;
  showControls?: boolean;
  starsPreset?: PresetType;
  autoRotate?: boolean;
  mouseInteraction?: boolean;
}

export function StarfieldBackground({
  starsConfig,
  showControls = true,
  starsPreset = "default",
  autoRotate = true,
  mouseInteraction = true,
}: StarfieldBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const starBuilderRef = useRef<StarEffectsBuilder>(null);
  const animationIdRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [config, setConfig] = useState<StarConfig>(() => {
    if (starsConfig) return starsConfig;
    const preset = starPresets[starsPreset];
    return preset ? { ...defaultStarConfig, ...preset } : defaultStarConfig;
  });
  const [showPanel, setShowPanel] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Initialize star effects builder
    const starBuilder = new StarEffectsBuilder(scene, config);
    starBuilderRef.current = starBuilder;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseInteraction) return;

      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      // Update star effects
      starBuilder.update();

      // Mouse interaction - subtle camera movement
      if (mouseInteraction) {
        camera.position.x +=
          (mouseRef.current.x * 0.5 - camera.position.x) * 0.02;
        camera.position.y +=
          (mouseRef.current.y * 0.5 - camera.position.y) * 0.02;
      }

      // Auto rotation
      if (autoRotate) {
        camera.rotation.z += 0.0001;
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
    setIsInitialized(true);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Keyboard shortcuts
    // const handleKeyPress = (event: KeyboardEvent) => {
    //   if (!showControls) return;

    //   if (event.key === "s" && event.ctrlKey) {
    //     event.preventDefault();
    //     setShowPanel(!showPanel);
    //   }

    //   // Preset shortcuts
    //   const presetKeys: Record<string, string> = {
    //     "1": "default",
    //     "2": "galaxy",
    //     "3": "nebula",
    //     "4": "hyperspace",
    //     "5": "aurora",
    //     "6": "fireflies",
    //   };

    //   if (presetKeys[event.key]) {
    //     handlePresetLoad(presetKeys[event.key]);
    //   }
    // };
    // window.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      // window.removeEventListener("keydown", handleKeyPress);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      starBuilder.dispose();
      renderer.dispose();
      setIsInitialized(false);
    };
  }, [autoRotate, mouseInteraction, showControls]);

  // Update star effects when config changes
  useEffect(() => {
    if (starBuilderRef.current && isInitialized) {
      starBuilderRef.current.updateConfig(config);
    }
  }, [config, isInitialized]);

  const handleConfigChange = (newConfig: Partial<StarConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handlePresetLoad = (presetName: string) => {
    const preset = starPresets[presetName];
    if (preset) {
      setConfig({ ...defaultStarConfig, ...preset });
    }
  };

  return (
    <>
      <div
        ref={mountRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "transparent" }}
      />

      {/* Controls */}
      {showControls && (
        <>
          {/* Toggle panel button */}
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 text-sm hover:bg-background/90 transition-colors"
            title="Toggle Star Effects Panel (Ctrl+S)"
          >
            ⭐ Effects
          </button>

          {/* Quick preset buttons */}
          <div className="fixed top-16 right-4 z-50 flex flex-col gap-1">
            {Object.keys(starPresets)
              .slice(0, 6)
              .map((preset, index) => (
                <button
                  key={preset}
                  onClick={() => handlePresetLoad(preset)}
                  className="bg-background/60 backdrop-blur-sm border rounded px-2 py-1 text-xs hover:bg-background/80 transition-colors"
                  title={`Load ${preset} preset (${index + 1})`}
                >
                  {index + 1}
                </button>
              ))}
          </div>

          {/* Configuration panel */}
          {showPanel && (
            <StarEffectsPanel
              config={config}
              onConfigChange={handleConfigChange}
              onPresetLoad={handlePresetLoad}
            />
          )}

          {/* Help text */}
          <div className="fixed bottom-4 left-4 z-50 bg-background/60 backdrop-blur-sm border rounded-lg p-2 text-xs text-muted-foreground max-w-xs">
            <div className="font-medium mb-1">Controls:</div>
            <div>Ctrl+S: Toggle panel</div>
            <div>1-6: Quick presets</div>
            <div>Mouse: Camera movement</div>
          </div>
        </>
      )}
    </>
  );
}

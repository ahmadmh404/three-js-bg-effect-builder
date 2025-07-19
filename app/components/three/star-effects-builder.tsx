"use client";

import * as THREE from "three";

// Star material types
export type StarMaterialType =
  | "basic"
  | "points"
  | "sprite"
  | "custom"
  | "glow"
  | "trail";

// Direction presets
export type DirectionPreset =
  | "random"
  | "outward"
  | "inward"
  | "spiral"
  | "wave"
  | "orbit"
  | "custom";

// Color schemes
export type ColorScheme =
  | "default"
  | "warm"
  | "cool"
  | "rainbow"
  | "galaxy"
  | "nebula"
  | "custom";

// Size distribution types
export type SizeDistribution =
  | "uniform"
  | "random"
  | "gradient"
  | "clustered"
  | "custom";

// Speed patterns
export type SpeedPattern =
  | "constant"
  | "random"
  | "pulsing"
  | "accelerating"
  | "custom";

// Star configuration interface
export interface StarConfig {
  // Basic properties
  count: number;
  material: StarMaterialType;

  // Visual properties
  colors: ColorScheme | THREE.Color[];
  sizes: {
    distribution: SizeDistribution;
    min: number;
    max: number;
    customSizes?: number[];
  };

  // Movement properties
  direction: DirectionPreset | THREE.Vector3[];
  speed: {
    pattern: SpeedPattern;
    min: number;
    max: number;
    customSpeeds?: number[];
  };

  // Advanced properties
  opacity: {
    min: number;
    max: number;
    fade: boolean;
  };

  // Animation properties
  twinkle: {
    enabled: boolean;
    speed: number;
    intensity: number;
  };

  // Physics properties
  gravity: THREE.Vector3;
  boundaries: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
    wrap: boolean;
  };

  // Special effects
  trails: {
    enabled: boolean;
    length: number;
    opacity: number;
  };

  glow: {
    enabled: boolean;
    intensity: number;
    size: number;
  };
}

// Default configuration
export const defaultStarConfig: StarConfig = {
  count: 1000,
  material: "points",
  colors: "default",
  sizes: {
    distribution: "random",
    min: 1,
    max: 3,
  },
  direction: "inward",
  speed: {
    pattern: "random",
    min: 0.01,
    max: 0.05,
  },
  opacity: {
    min: 0.3,
    max: 1.0,
    fade: true,
  },
  twinkle: {
    enabled: true,
    speed: 0.02,
    intensity: 0.3,
  },
  gravity: new THREE.Vector3(0, 0, 0),
  boundaries: {
    x: [-50, 50],
    y: [-50, 50],
    z: [-50, 50],
    wrap: true,
  },
  trails: {
    enabled: false,
    length: 10,
    opacity: 0.5,
  },
  glow: {
    enabled: false,
    intensity: 1.0,
    size: 2.0,
  },
};

// Color schemes
export const colorSchemes: Record<ColorScheme, THREE.Color[]> = {
  default: [
    new THREE.Color(0x9bb5ff), // Blue
    new THREE.Color(0xaabfff), // Light blue
    new THREE.Color(0xcad7ff), // Very light blue
    new THREE.Color(0xf8f7ff), // White
    new THREE.Color(0xfff4ea), // Warm white
    new THREE.Color(0xffd2a1), // Orange
    new THREE.Color(0xffad51), // Yellow-orange
  ],
  warm: [
    new THREE.Color(0xff6b35), // Orange red
    new THREE.Color(0xff8c42), // Orange
    new THREE.Color(0xffa726), // Amber
    new THREE.Color(0xffcc02), // Yellow
    new THREE.Color(0xfff59d), // Light yellow
  ],
  cool: [
    new THREE.Color(0x1e3a8a), // Deep blue
    new THREE.Color(0x3b82f6), // Blue
    new THREE.Color(0x06b6d4), // Cyan
    new THREE.Color(0x10b981), // Emerald
    new THREE.Color(0x8b5cf6), // Purple
  ],
  rainbow: [
    new THREE.Color(0xff0000), // Red
    new THREE.Color(0xff8000), // Orange
    new THREE.Color(0xffff00), // Yellow
    new THREE.Color(0x00ff00), // Green
    new THREE.Color(0x0080ff), // Blue
    new THREE.Color(0x8000ff), // Purple
  ],
  galaxy: [
    new THREE.Color(0x4a0e4e), // Deep purple
    new THREE.Color(0x81689d), // Purple
    new THREE.Color(0xffd700), // Gold
    new THREE.Color(0xff69b4), // Pink
    new THREE.Color(0x00ced1), // Turquoise
  ],
  nebula: [
    new THREE.Color(0xff1493), // Deep pink
    new THREE.Color(0x9932cc), // Dark orchid
    new THREE.Color(0x4169e1), // Royal blue
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0x98fb98), // Pale green
  ],
  custom: [], // Will be populated by user
};

// Star particle class
export class StarParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  color: THREE.Color;
  opacity: number;
  twinklePhase: number;
  life: number;
  maxLife: number;
  trail: THREE.Vector3[];

  constructor(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    size: number,
    color: THREE.Color,
    opacity = 1
  ) {
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.size = size;
    this.color = color.clone();
    this.opacity = opacity;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.life = 0;
    this.maxLife = Math.random() * 1000 + 500;
    this.trail = [];
  }

  update(config: StarConfig, deltaTime: number) {
    // Update position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    // Apply gravity
    this.velocity.add(config.gravity.clone().multiplyScalar(deltaTime));

    // Update twinkle
    if (config.twinkle.enabled) {
      this.twinklePhase += config.twinkle.speed;
    }

    // Update life
    this.life += deltaTime;

    // Update trail
    if (config.trails.enabled) {
      this.trail.push(this.position.clone());
      if (this.trail.length > config.trails.length) {
        this.trail.shift();
      }
    }

    // Handle boundaries
    this.handleBoundaries(config.boundaries);
  }

  private handleBoundaries(boundaries: StarConfig["boundaries"]) {
    if (boundaries.wrap) {
      // Wrap around boundaries
      if (this.position.x < boundaries.x[0]) this.position.x = boundaries.x[1];
      if (this.position.x > boundaries.x[1]) this.position.x = boundaries.x[0];
      if (this.position.y < boundaries.y[0]) this.position.y = boundaries.y[1];
      if (this.position.y > boundaries.y[1]) this.position.y = boundaries.y[0];
      if (this.position.z < boundaries.z[0]) this.position.z = boundaries.z[1];
      if (this.position.z > boundaries.z[1]) this.position.z = boundaries.z[0];
    } else {
      // Bounce off boundaries
      if (
        this.position.x < boundaries.x[0] ||
        this.position.x > boundaries.x[1]
      ) {
        this.velocity.x *= -1;
      }
      if (
        this.position.y < boundaries.y[0] ||
        this.position.y > boundaries.y[1]
      ) {
        this.velocity.y *= -1;
      }
      if (
        this.position.z < boundaries.z[0] ||
        this.position.z > boundaries.z[1]
      ) {
        this.velocity.z *= -1;
      }
    }
  }

  getTwinkleOpacity(baseOpacity: number, intensity: number): number {
    return baseOpacity + Math.sin(this.twinklePhase) * intensity;
  }

  shouldRespawn(): boolean {
    return this.life > this.maxLife;
  }

  respawn(config: StarConfig) {
    this.position = this.generateRandomPosition(config.boundaries);
    this.velocity = this.generateVelocity(config.direction, config.speed);
    this.life = 0;
    this.maxLife = Math.random() * 1000 + 500;
    this.trail = [];
  }

  private generateRandomPosition(
    boundaries: StarConfig["boundaries"]
  ): THREE.Vector3 {
    return new THREE.Vector3(
      Math.random() * (boundaries.x[1] - boundaries.x[0]) + boundaries.x[0],
      Math.random() * (boundaries.y[1] - boundaries.y[0]) + boundaries.y[0],
      Math.random() * (boundaries.z[1] - boundaries.z[0]) + boundaries.z[0]
    );
  }

  private generateVelocity(
    direction: DirectionPreset | THREE.Vector3[],
    speed: StarConfig["speed"]
  ): THREE.Vector3 {
    let velocity = new THREE.Vector3();

    if (Array.isArray(direction)) {
      // Custom directions
      const randomDirection =
        direction[Math.floor(Math.random() * direction.length)];
      velocity = randomDirection.clone();
    } else {
      // Preset directions
      switch (direction) {
        case "random":
          velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize();
          break;
        case "outward":
          velocity = this.position.clone().normalize();
          break;
        case "inward":
          velocity = this.position.clone().normalize().multiplyScalar(-1);
          break;
        case "spiral":
          const angle = Math.atan2(this.position.y, this.position.x) + 0.1;
          velocity = new THREE.Vector3(
            Math.cos(angle),
            Math.sin(angle),
            Math.random() - 0.5
          ).normalize();
          break;
        case "wave":
          velocity = new THREE.Vector3(
            Math.sin(this.position.y * 0.1),
            Math.cos(this.position.x * 0.1),
            Math.sin(this.position.z * 0.1)
          ).normalize();
          break;
        case "orbit":
          velocity = new THREE.Vector3(
            -this.position.y,
            this.position.x,
            0
          ).normalize();
          break;
      }
    }

    // Apply speed
    const speedMultiplier =
      speed.pattern === "random"
        ? Math.random() * (speed.max - speed.min) + speed.min
        : speed.min;

    return velocity.multiplyScalar(speedMultiplier);
  }
}

// Star effects builder class
export class StarEffectsBuilder {
  private scene: THREE.Scene;
  private particles: StarParticle[] = [];
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;
  private points: THREE.Points;
  private config: StarConfig;
  private clock: THREE.Clock;

  constructor(scene: THREE.Scene, config: Partial<StarConfig> = {}) {
    this.scene = scene;
    this.config = { ...defaultStarConfig, ...config };
    this.clock = new THREE.Clock();
    this.geometry = new THREE.BufferGeometry();

    this.initializeParticles();
    this.createMaterial();
    this.createPoints();
  }

  private initializeParticles() {
    this.particles = [];

    for (let i = 0; i < this.config.count; i++) {
      const position = this.generateRandomPosition();
      const velocity = this.generateVelocity(position);
      const size = this.generateSize(i);
      const color = this.generateColor(i);
      const opacity = this.generateOpacity();

      const particle = new StarParticle(
        position,
        velocity,
        size,
        color,
        opacity
      );
      this.particles.push(particle);
    }
  }

  private generateRandomPosition(): THREE.Vector3 {
    const { boundaries } = this.config;
    return new THREE.Vector3(
      Math.random() * (boundaries.x[1] - boundaries.x[0]) + boundaries.x[0],
      Math.random() * (boundaries.y[1] - boundaries.y[0]) + boundaries.y[0],
      Math.random() * (boundaries.z[1] - boundaries.z[0]) + boundaries.z[0]
    );
  }

  private generateVelocity(position: THREE.Vector3): THREE.Vector3 {
    const { direction, speed } = this.config;
    let velocity = new THREE.Vector3();

    if (Array.isArray(direction)) {
      const randomDirection =
        direction[Math.floor(Math.random() * direction.length)];
      velocity = randomDirection.clone();
    } else {
      switch (direction) {
        case "random":
          velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize();
          break;
        case "outward":
          velocity = position.clone().normalize();
          break;
        case "inward":
          velocity = position.clone().normalize().multiplyScalar(-1);
          break;
        case "spiral":
          const angle = Math.atan2(position.y, position.x) + 0.1;
          velocity = new THREE.Vector3(
            Math.cos(angle),
            Math.sin(angle),
            Math.random() - 0.5
          ).normalize();
          break;
        case "wave":
          velocity = new THREE.Vector3(
            Math.sin(position.y * 0.1),
            Math.cos(position.x * 0.1),
            Math.sin(position.z * 0.1)
          ).normalize();
          break;
        case "orbit":
          velocity = new THREE.Vector3(-position.y, position.x, 0).normalize();
          break;
      }
    }

    const speedMultiplier =
      speed.pattern === "random"
        ? Math.random() * (speed.max - speed.min) + speed.min
        : speed.min;

    return velocity.multiplyScalar(speedMultiplier);
  }

  private generateSize(index: number): number {
    const { sizes } = this.config;

    switch (sizes.distribution) {
      case "uniform":
        return (sizes.min + sizes.max) / 2;
      case "random":
        return Math.random() * (sizes.max - sizes.min) + sizes.min;
      case "gradient":
        const ratio = index / this.config.count;
        return sizes.min + ratio * (sizes.max - sizes.min);
      case "clustered":
        return Math.random() < 0.8 ? sizes.min : sizes.max;
      case "custom":
        return (
          sizes.customSizes?.[index % sizes.customSizes.length] || sizes.min
        );
      default:
        return sizes.min;
    }
  }

  private generateColor(index: number): THREE.Color {
    const { colors } = this.config;

    if (Array.isArray(colors)) {
      return colors[index % colors.length].clone();
    }

    const colorArray = colorSchemes[colors as ColorScheme];
    return colorArray[Math.floor(Math.random() * colorArray.length)].clone();
  }

  private generateOpacity(): number {
    const { opacity } = this.config;
    return Math.random() * (opacity.max - opacity.min) + opacity.min;
  }

  private createMaterial() {
    const { material, glow } = this.config;

    switch (material) {
      case "basic":
        this.material = new THREE.PointsMaterial({
          size: 2,
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });
        break;

      case "points":
        this.material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          },
          vertexShader: `
            attribute float starSize;
            attribute vec3 starColor;
            attribute float starOpacity;
            varying vec3 vColor;
            varying float vOpacity;
            uniform float time;
            uniform float pixelRatio;
            
            void main() {
              vColor = starColor;
              vOpacity = starOpacity;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              
              float pulse = sin(time * 2.0 + position.x * 0.1) * 0.3 + 0.7;
              gl_PointSize = starSize * pulse * pixelRatio * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vOpacity;
            
            void main() {
              float distance = length(gl_PointCoord - vec2(0.5));
              float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
              float sparkle = pow(alpha, 2.0);
              
              gl_FragColor = vec4(vColor, alpha * sparkle * vOpacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        break;

      case "glow":
        this.material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            glowIntensity: { value: glow.intensity },
            glowSize: { value: glow.size },
          },
          vertexShader: `
            attribute float starSize;
            attribute vec3 starColor;
            attribute float starOpacity;
            varying vec3 vColor;
            varying float vOpacity;
            uniform float time;
            uniform float glowSize;
            
            void main() {
              vColor = starColor;
              vOpacity = starOpacity;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              
              gl_PointSize = starSize * glowSize * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vOpacity;
            uniform float glowIntensity;
            
            void main() {
              float distance = length(gl_PointCoord - vec2(0.5));
              float glow = exp(-distance * 8.0) * glowIntensity;
              float core = 1.0 - smoothstep(0.0, 0.1, distance);
              
              float alpha = (glow + core) * vOpacity;
              gl_FragColor = vec4(vColor * (1.0 + glow), alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        break;

      default:
        this.material = new THREE.PointsMaterial({
          size: 2,
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });
    }
  }

  private createPoints() {
    this.updateGeometry();
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  private updateGeometry() {
    const positions = new Float32Array(this.particles.length * 3);
    const colors = new Float32Array(this.particles.length * 3);
    const sizes = new Float32Array(this.particles.length);
    const opacities = new Float32Array(this.particles.length);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const i3 = i * 3;

      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      colors[i3] = particle.color.r;
      colors[i3 + 1] = particle.color.g;
      colors[i3 + 2] = particle.color.b;

      sizes[i] = particle.size;

      const twinkleOpacity = this.config.twinkle.enabled
        ? particle.getTwinkleOpacity(
            particle.opacity,
            this.config.twinkle.intensity
          )
        : particle.opacity;

      opacities[i] = Math.max(0, Math.min(1, twinkleOpacity));
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute(
      "starColor",
      new THREE.BufferAttribute(colors, 3)
    );
    this.geometry.setAttribute("starSize", new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute(
      "starOpacity",
      new THREE.BufferAttribute(opacities, 1)
    );
  }

  public update() {
    const deltaTime = this.clock.getDelta() * 60; // Normalize to 60fps

    // Update particles
    for (const particle of this.particles) {
      particle.update(this.config, deltaTime);

      if (particle.shouldRespawn()) {
        particle.respawn(this.config);
      }
    }

    // Update geometry
    this.updateGeometry();
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.starColor.needsUpdate = true;
    this.geometry.attributes.starSize.needsUpdate = true;
    this.geometry.attributes.starOpacity.needsUpdate = true;

    // Update material uniforms
    if (this.material instanceof THREE.ShaderMaterial) {
      this.material.uniforms.time.value = this.clock.getElapsedTime();
    }
  }

  public updateConfig(newConfig: Partial<StarConfig>) {
    this.config = { ...this.config, ...newConfig };

    // Reinitialize if count changed
    if (newConfig.count && newConfig.count !== this.particles.length) {
      this.dispose();
      this.initializeParticles();
      this.createMaterial();
      this.createPoints();
    } else {
      // Update existing particles
      this.particles.forEach((particle, index) => {
        if (newConfig.colors) {
          particle.color = this.generateColor(index);
        }
        if (newConfig.sizes) {
          particle.size = this.generateSize(index);
        }
      });

      if (newConfig.material) {
        this.createMaterial();
        this.points.material = this.material;
      }
    }
  }

  public dispose() {
    if (this.points) {
      this.scene.remove(this.points);
    }
    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
  }
}

export type PresetType =
  | "default"
  | "galaxy"
  | "nebula"
  | "hyperspace"
  | "aurora"
  | "fireflies";

// Preset configurations
export const starPresets: Record<PresetType, Partial<StarConfig>> = {
  default: defaultStarConfig,

  galaxy: {
    count: 2000,
    material: "glow",
    colors: "galaxy",
    direction: "spiral",
    speed: { pattern: "random", min: 0.005, max: 0.02 },
    glow: { enabled: true, intensity: 1.5, size: 2 },
    twinkle: { enabled: true, speed: 0.01, intensity: 0.4 },
  },

  nebula: {
    count: 1500,
    material: "glow",
    colors: "nebula",
    direction: "wave",
    speed: { pattern: "random", min: 0.002, max: 0.01 },
    glow: { enabled: true, intensity: 2, size: 3 },
    sizes: { distribution: "clustered", min: 1, max: 5 },
  },

  hyperspace: {
    count: 800,
    material: "points",
    colors: "cool",
    direction: "outward",
    speed: { pattern: "accelerating", min: 0.1, max: 0.5 },
    trails: { enabled: true, length: 15, opacity: 0.7 },
    sizes: { distribution: "gradient", min: 0.5, max: 2 },
  },

  aurora: {
    count: 1200,
    material: "glow",
    colors: "rainbow",
    direction: "wave",
    speed: { pattern: "pulsing", min: 0.01, max: 0.03 },
    glow: { enabled: true, intensity: 1.8, size: 2.5 },
    twinkle: { enabled: true, speed: 0.03, intensity: 0.5 },
  },

  fireflies: {
    count: 300,
    material: "glow",
    colors: "warm",
    direction: "random",
    speed: { pattern: "random", min: 0.005, max: 0.015 },
    glow: { enabled: true, intensity: 2.5, size: 4 },
    sizes: { distribution: "random", min: 2, max: 6 },
    twinkle: { enabled: true, speed: 0.05, intensity: 0.8 },
  },
};

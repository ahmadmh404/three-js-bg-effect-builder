"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  color: string;
  twinkle: number;
}

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // TODO: make the user choose from the same stars palletts or pass one in the props
    const colors = [
      "#9bb5ff", // Blue
      "#aabfff", // Light blue
      "#cad7ff", // Very light blue
      "#f8f7ff", // White
      "#fff4ea", // Warm white
      "#ffd2a1", // Orange
      "#ffad51", // Yellow-orange
    ];

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(
        150,
        Math.floor((canvas.width * canvas.height) / 8000)
      );

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: Math.random() * 2 + 1,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    initParticles();

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Shooting stars data
    const shootingStars: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    const drawShootingStars = () => {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.life++;
        star.x += star.vx;
        star.y += star.vy;

        const opacity = 1 - star.life / star.maxLife;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * 5, star.y - star.vy * 5);
        ctx.stroke();
        ctx.restore();

        if (star.life >= star.maxLife) {
          shootingStars.splice(i, 1);
        }
      }
    };

    // Animation loop
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= particle.vz;

        // Reset particle if off screen or too close
        if (
          particle.z <= 0 ||
          particle.x < -50 ||
          particle.x > canvas.width + 50 ||
          particle.y < -50 ||
          particle.y > canvas.height + 50
        ) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.z = 1000;
        }

        // Calculate perspective
        const perspective = 1000 / (1000 - particle.z);
        const x = particle.x * perspective;
        const y = particle.y * perspective;
        const size = particle.size * perspective;

        // Update twinkle effect
        particle.twinkle += 0.02;
        const twinkleEffect = Math.sin(particle.twinkle) * 0.3 + 0.7;

        // Calculate opacity with twinkle and distance effect
        const opacity =
          particle.opacity * twinkleEffect * Math.min(1, particle.z / 200);

        // Mouse interaction effect
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - x, 2) +
            Math.pow(mouseRef.current.y - y, 2)
        );
        const mouseEffect = Math.max(0, 1 - mouseDistance / 150);
        const finalSize = size + mouseEffect * 2;
        const finalOpacity = Math.min(1, opacity + mouseEffect * 0.5);

        // Draw particle
        ctx.save();
        ctx.globalAlpha = finalOpacity;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = finalSize * 2;

        ctx.beginPath();
        ctx.arc(x, y, finalSize, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle effect for bigger particles
        if (finalSize > 2) {
          ctx.globalAlpha = finalOpacity * 0.5;
          ctx.beginPath();
          ctx.arc(x, y, finalSize * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      drawShootingStars();

      if (Math.random() < 0.002) {
        createShootingStar();
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Resize handler
    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

const MAX_PARTICLES = 120;
const MIN_TRAIL_DISTANCE = 3;

function createParticle(x, y, velocityX, velocityY, speed) {
  const angle = Math.random() * Math.PI * 2;
  const scatter = 0.004 + Math.random() * 0.018;

  return {
    x: x + (Math.random() - 0.5) * 8,
    y: y + (Math.random() - 0.5) * 8,
    velocityX: velocityX * 0.035 + Math.cos(angle) * scatter,
    velocityY:
      velocityY * 0.025 + Math.sin(angle) * scatter - 0.004,
    radius: 1 + Math.random() * 2.4 + Math.min(speed * 0.32, 0.9),
    age: 0,
    life: 1250 + Math.random() * 1050,
    phase: Math.random() * Math.PI * 2,
    opacity: 0.22 + Math.random() * 0.26,
  };
}

export function InkParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) return undefined;

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!context) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const precisePointer = window.matchMedia("(pointer: fine)");
    const particles = [];

    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrameTime = 0;
    let lastPointer = null;
    let isRunning = false;

    function clearField() {
      window.cancelAnimationFrame(frameId);
      particles.length = 0;
      lastPointer = null;
      lastFrameTime = 0;
      isRunning = false;
      context.clearRect(0, 0, width, height);
    }

    function resize() {
      const bounds = container.getBoundingClientRect();

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelBudgetRatio = Math.sqrt(2_000_000 / (width * height));
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        1.35,
        pixelBudgetRatio,
      );
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      clearField();
    }

    function paintParticle(particle) {
      const progress = particle.age / particle.life;
      const fadeIn = Math.min(1, particle.age / 100);
      const fadeOut = Math.pow(1 - progress, 1.7);
      const alpha = particle.opacity * fadeIn * fadeOut;
      const radius = particle.radius + progress * 4.2;
      const currentPhase =
        document.documentElement.dataset.timescape ?? "dawn";
      const colors = {
        dawn: ["#799d9b", "rgba(106, 151, 148, 0.45)"],
        mist: ["#6e8f94", "rgba(108, 145, 150, 0.42)"],
        dusk: ["#ce8b69", "rgba(204, 121, 88, 0.44)"],
        night: ["#a5cbd3", "rgba(117, 185, 201, 0.5)"],
      };
      const [fill, glow] = colors[currentPhase] ?? colors.dawn;

      context.globalAlpha = alpha;
      context.fillStyle = fill;
      context.shadowColor = glow;
      context.shadowBlur = 7 + radius * 2.2;
      context.beginPath();
      context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = alpha * 0.26;
      context.shadowBlur = 0;
      context.beginPath();
      context.arc(
        particle.x + Math.sin(particle.phase) * radius,
        particle.y - radius * 0.4,
        radius * 1.8,
        0,
        Math.PI * 2,
      );
      context.fill();
    }

    function animate(time) {
      if (!lastFrameTime) lastFrameTime = time;

      const delta = Math.min(34, time - lastFrameTime);
      lastFrameTime = time;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.age += delta;

        if (particle.age >= particle.life) {
          particles.splice(index, 1);
          continue;
        }

        const damping = Math.pow(0.988, delta / 16);
        particle.velocityX *= damping;
        particle.velocityY = particle.velocityY * damping - 0.00022 * delta;
        particle.x +=
          particle.velocityX * delta +
          Math.sin(particle.phase + particle.age * 0.0024) * 0.014 * delta;
        particle.y += particle.velocityY * delta;
        paintParticle(particle);
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;

      if (particles.length > 0 && !document.hidden) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        isRunning = false;
        lastFrameTime = 0;
        context.clearRect(0, 0, width, height);
      }
    }

    function startAnimation() {
      if (isRunning || particles.length === 0 || document.hidden) return;

      isRunning = true;
      frameId = window.requestAnimationFrame(animate);
    }

    function addTrail(event) {
      if (
        reduceMotion.matches ||
        !precisePointer.matches ||
        event.pointerType === "touch"
      ) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      if (x < 0 || y < 0 || x > width || y > height) {
        lastPointer = null;
        return;
      }

      if (!lastPointer || event.timeStamp - lastPointer.time > 140) {
        particles.push(createParticle(x, y, 0, 0, 0));
        lastPointer = { x, y, time: event.timeStamp };
        startAnimation();
        return;
      }

      const deltaX = x - lastPointer.x;
      const deltaY = y - lastPointer.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < MIN_TRAIL_DISTANCE) return;

      const elapsed = Math.max(8, event.timeStamp - lastPointer.time);
      const speed = distance / elapsed;
      const particleCount = Math.min(5, Math.max(1, Math.ceil(distance / 13)));

      for (let index = 1; index <= particleCount; index += 1) {
        const progress = index / particleCount;
        particles.push(
          createParticle(
            lastPointer.x + deltaX * progress,
            lastPointer.y + deltaY * progress,
            deltaX / elapsed,
            deltaY / elapsed,
            speed,
          ),
        );
      }

      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }

      lastPointer = { x, y, time: event.timeStamp };
      startAnimation();
    }

    function handlePointerLeave() {
      lastPointer = null;
    }

    function handlePreferenceChange() {
      clearField();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearField();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", addTrail, { passive: true });
    document.documentElement.addEventListener(
      "mouseleave",
      handlePointerLeave,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reduceMotion.addEventListener("change", handlePreferenceChange);
    precisePointer.addEventListener("change", handlePreferenceChange);
    resize();

    return () => {
      clearField();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", addTrail);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave,
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      reduceMotion.removeEventListener("change", handlePreferenceChange);
      precisePointer.removeEventListener("change", handlePreferenceChange);
    };
  }, []);

  return <canvas className="ink-particle-field" ref={canvasRef} aria-hidden />;
}

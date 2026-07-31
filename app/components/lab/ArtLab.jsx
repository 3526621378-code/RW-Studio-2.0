"use client";

import { useEffect, useRef, useState } from "react";

const MODES = [
  { id: "mist", label: "Mist Field", labelZh: "雾场" },
  { id: "ink", label: "Ink Diffusion", labelZh: "墨扩散" },
  { id: "light", label: "Light Particles", labelZh: "光粒子" },
];

const DEFAULT_SETTINGS = {
  flow: 42,
  density: 58,
  diffusion: 36,
};

function fitCanvas(canvas, container, context) {
  const bounds = container.getBoundingClientRect();
  const width = Math.max(320, bounds.width);
  const height = Math.max(280, bounds.height);
  const budgetRatio = Math.sqrt(2_200_000 / (width * height));
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5, budgetRatio);

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  return { width, height };
}

function getPalette() {
  const phase = document.documentElement.dataset.timescape ?? "mist";
  const palettes = {
    dawn: {
      base: "#d8d3c7",
      deep: "rgba(38, 62, 62, 0.54)",
      mid: "rgba(85, 128, 128, 0.42)",
      light: "rgba(238, 221, 192, 0.5)",
    },
    mist: {
      base: "#c9d1cf",
      deep: "rgba(36, 62, 69, 0.54)",
      mid: "rgba(88, 126, 134, 0.42)",
      light: "rgba(236, 242, 237, 0.5)",
    },
    dusk: {
      base: "#c5a189",
      deep: "rgba(49, 48, 49, 0.58)",
      mid: "rgba(170, 92, 64, 0.4)",
      light: "rgba(243, 187, 135, 0.45)",
    },
    night: {
      base: "#182329",
      deep: "rgba(3, 14, 19, 0.72)",
      mid: "rgba(77, 145, 159, 0.46)",
      light: "rgba(199, 226, 224, 0.54)",
    },
  };

  return palettes[phase] ?? palettes.mist;
}

function drawMist(context, width, height, time, settings, pointer) {
  const palette = getPalette();
  const amount = Math.round(6 + settings.density * 0.15);
  const speed = settings.flow * 0.000035;
  const spread = 28 + settings.diffusion * 0.72;
  const wash = context.createLinearGradient(0, 0, width, height);

  wash.addColorStop(0, palette.base);
  wash.addColorStop(1, palette.deep);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);

  context.globalCompositeOperation = "screen";

  for (let index = 0; index < amount; index += 1) {
    const phase = time * speed + index * 1.39;
    const x =
      width * (index / Math.max(1, amount - 1)) +
      Math.sin(phase * 1.7) * spread +
      pointer.x * (10 + index * 0.4);
    const y =
      height * (0.18 + ((index * 0.17) % 0.68)) +
      Math.cos(phase) * spread * 0.55 +
      pointer.y * 16;
    const radius = width * (0.12 + (index % 4) * 0.035);
    const cloud = context.createRadialGradient(x, y, 0, x, y, radius);

    cloud.addColorStop(0, palette.light);
    cloud.addColorStop(0.42, palette.mid);
    cloud.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.globalAlpha = 0.54;
    context.fillStyle = cloud;
    context.beginPath();
    context.ellipse(x, y, radius, radius * 0.38, phase * 0.1, 0, Math.PI * 2);
    context.fill();
  }
}

function drawInk(context, width, height, time, settings, pointer) {
  const palette = getPalette();
  const amount = Math.round(18 + settings.density * 0.42);
  const originX = width * (0.5 + pointer.x * 0.16);
  const originY = height * (0.5 + pointer.y * 0.16);

  context.globalCompositeOperation = "source-over";
  context.fillStyle = palette.base;
  context.fillRect(0, 0, width, height);

  for (let index = 0; index < amount; index += 1) {
    const seed = index * 12.9898;
    const angle = seed + time * settings.flow * 0.00001;
    const distance =
      (Math.sin(seed * 4.1) * 0.5 + 0.5) *
      Math.min(width, height) *
      0.37;
    const wobble = Math.sin(time * 0.00055 + seed) * settings.diffusion * 0.22;
    const x = originX + Math.cos(angle) * (distance + wobble);
    const y = originY + Math.sin(angle * 1.17) * (distance * 0.62 + wobble);
    const radius =
      2 + ((index * 7) % 13) + settings.diffusion * 0.075;
    const bloom = context.createRadialGradient(x, y, 0, x, y, radius * 4.6);

    bloom.addColorStop(0, palette.deep);
    bloom.addColorStop(0.28, palette.mid);
    bloom.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.globalAlpha = 0.38 + (index % 5) * 0.06;
    context.fillStyle = bloom;
    context.beginPath();
    context.arc(x, y, radius * 4.6, 0, Math.PI * 2);
    context.fill();
  }

  context.globalAlpha = 0.24;
  context.strokeStyle = palette.deep;
  context.lineWidth = 0.8;
  context.beginPath();

  for (let point = 0; point <= 140; point += 1) {
    const x = (point / 140) * width;
    const y =
      height * 0.51 +
      Math.sin(point * 0.11 + time * 0.0003) * settings.diffusion * 0.32 +
      Math.sin(point * 0.027) * height * 0.11;

    if (point === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.stroke();
}

function drawLight(context, width, height, time, settings, pointer) {
  const palette = getPalette();
  const amount = Math.round(24 + settings.density * 0.7);
  const wash = context.createRadialGradient(
    width * 0.5,
    height * 0.35,
    0,
    width * 0.5,
    height * 0.5,
    width * 0.8,
  );

  wash.addColorStop(0, palette.mid);
  wash.addColorStop(1, palette.base);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "screen";

  for (let index = 0; index < amount; index += 1) {
    const seed = index * 9.731;
    const x =
      ((Math.sin(seed * 4.4) * 0.5 + 0.5) * width +
        time * settings.flow * 0.0012 +
        pointer.x * width * 0.04) %
      (width + 40);
    const y =
      (Math.sin(seed * 1.7 + time * 0.00018) * 0.5 + 0.5) * height +
      pointer.y * height * 0.04;
    const radius = 1.2 + (index % 7) * 0.46 + settings.diffusion * 0.025;
    const halo = context.createRadialGradient(x, y, 0, x, y, radius * 5.8);

    halo.addColorStop(0, palette.light);
    halo.addColorStop(0.18, palette.mid);
    halo.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.globalAlpha = 0.42 + (index % 4) * 0.12;
    context.fillStyle = halo;
    context.beginPath();
    context.arc(x, y, radius * 5.8, 0, Math.PI * 2);
    context.fill();
  }
}

function GenerativeCanvas({ mode, settings, paused, resetVersion, canvasRef }) {
  const containerRef = useRef(null);
  const settingsRef = useRef(settings);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return undefined;

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!context) return undefined;

    let frameId = 0;
    let size = fitCanvas(canvas, container, context);

    function draw(time = 0) {
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      const values = settingsRef.current;

      if (mode === "mist") {
        drawMist(
          context,
          size.width,
          size.height,
          time,
          values,
          pointerRef.current,
        );
      } else if (mode === "ink") {
        drawInk(
          context,
          size.width,
          size.height,
          time,
          values,
          pointerRef.current,
        );
      } else {
        drawLight(
          context,
          size.width,
          size.height,
          time,
          values,
          pointerRef.current,
        );
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      if (!paused) frameId = window.requestAnimationFrame(draw);
    }

    function resize() {
      size = fitCanvas(canvas, container, context);
      if (paused) draw(performance.now());
    }

    function followPointer(event) {
      const bounds = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: (event.clientX - bounds.left) / bounds.width - 0.5,
        y: (event.clientY - bounds.top) / bounds.height - 0.5,
      };
    }

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    canvas.addEventListener("pointermove", followPointer, { passive: true });
    draw(performance.now());

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      canvas.removeEventListener("pointermove", followPointer);
    };
  }, [canvasRef, mode, paused, resetVersion]);

  return (
    <div className="lab-canvas-wrap" ref={containerRef}>
      <canvas
        className="lab-canvas"
        ref={canvasRef}
        aria-label={`${MODES.find((item) => item.id === mode)?.label} 生成艺术画布`}
      />
      <p className="lab-canvas-hint">Move to disturb the field</p>
    </div>
  );
}

function Slider({ id, label, value, onChange }) {
  return (
    <label className="lab-slider" htmlFor={id}>
      <span>
        {label}
        <output htmlFor={id}>{String(value).padStart(2, "0")}</output>
      </span>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function AICapabilityPanel({ onClose }) {
  const capabilities = [
    ["Image", "图像生成与风格探索"],
    ["Language", "概念发展与创作协作"],
    ["Video", "动态叙事与时序生成"],
    ["3D", "空间原型与装置预演"],
  ];

  return (
    <aside className="ai-panel" aria-labelledby="ai-panel-title">
      <div className="ai-panel-heading">
        <div>
          <p className="micro-label">Future interface / 概念界面</p>
          <h3 id="ai-panel-title">Model Gateway</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="关闭模型界面">
          Close
        </button>
      </div>

      <p className="ai-panel-intro">
        A future connection layer for creative models, designed to keep
        authorship and visual judgment in human hands.
      </p>

      <ul>
        {capabilities.map(([title, description]) => (
          <li key={title}>
            <span>{title}</span>
            <small>{description}</small>
          </li>
        ))}
      </ul>

      <div className="ai-connection-status">
        <span aria-hidden="true" />
        Interface not connected. No request will be sent.
      </div>
    </aside>
  );
}

export function ArtLab({ compact = false }) {
  const shellRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("mist");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [paused, setPaused] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const [showAI, setShowAI] = useState(false);

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function resetLab() {
    setSettings(DEFAULT_SETTINGS);
    setPaused(false);
    setResetVersion((current) => current + 1);
  }

  function downloadArtwork() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `rw-studio-${mode}-study.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function openFullscreen() {
    if (shellRef.current?.requestFullscreen) {
      await shellRef.current.requestFullscreen();
    }
  }

  return (
    <div
      className={`art-lab ${compact ? "art-lab-compact" : "art-lab-full"}`}
      ref={shellRef}
    >
      <div className="lab-toolbar">
        <div className="lab-mode-tabs" role="tablist" aria-label="实验模式">
          {MODES.map((item) => (
            <button
              type="button"
              key={item.id}
              role="tab"
              aria-selected={mode === item.id}
              className={mode === item.id ? "is-active" : ""}
              onClick={() => setMode(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.labelZh}</small>
            </button>
          ))}
        </div>

        {!compact ? (
          <div className="lab-actions" aria-label="画布操作">
            <button type="button" onClick={() => setPaused((value) => !value)}>
              {paused ? "Resume" : "Pause"}
            </button>
            <button type="button" onClick={resetLab}>
              Reset
            </button>
            <button type="button" onClick={openFullscreen}>
              Fullscreen
            </button>
            <button type="button" onClick={downloadArtwork}>
              Save PNG
            </button>
          </div>
        ) : null}
      </div>

      <div className="lab-workspace">
        <GenerativeCanvas
          mode={mode}
          settings={settings}
          paused={paused}
          resetVersion={resetVersion}
          canvasRef={canvasRef}
        />

        <div className="lab-controls">
          <div className="lab-controls-heading">
            <p className="micro-label">Live parameters</p>
            <span>01 · 03</span>
          </div>
          <Slider
            id={`${compact ? "preview" : "full"}-flow`}
            label="Flow / 流速"
            value={settings.flow}
            onChange={(value) => updateSetting("flow", value)}
          />
          <Slider
            id={`${compact ? "preview" : "full"}-density`}
            label="Density / 密度"
            value={settings.density}
            onChange={(value) => updateSetting("density", value)}
          />
          <Slider
            id={`${compact ? "preview" : "full"}-diffusion`}
            label="Diffusion / 扩散"
            value={settings.diffusion}
            onChange={(value) => updateSetting("diffusion", value)}
          />
        </div>
      </div>

      {!compact ? (
        <div className="lab-footer">
          <p>
            Runs entirely in your browser. The field is generated in real time
            and no image is uploaded.
          </p>
          <button
            className="ai-gateway-button"
            type="button"
            aria-expanded={showAI}
            onClick={() => setShowAI((value) => !value)}
          >
            Explore future AI gateway
            <span>Concept only</span>
          </button>
        </div>
      ) : null}

      {showAI ? <AICapabilityPanel onClose={() => setShowAI(false)} /> : null}
    </div>
  );
}

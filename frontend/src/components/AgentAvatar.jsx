import { useEffect, useRef } from "react";

/**
 * AgentAvatar — canvas-based animated avatar inspired by SmoothUI's AgentAvatar.
 * Generates a deterministic pixel pattern from a seed string with animated
 * color oscillation. Respects prefers-reduced-motion. No dependencies needed.
 *
 * Props:
 *   seed    {string}  — username or any string to generate the pattern from
 *   size    {number}  — pixel size of the avatar (default: 36)
 */
export default function AgentAvatar({ seed = "user", size = 36 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // ── Deterministic hash from seed ─────────────────────────────────────────
    const hash = (str) => {
      let h = 0x811c9dc5;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h * 0x01000193) >>> 0;
      }
      return h;
    };

    const GRID = 8; // pixel grid size
    const cellSize = size / GRID;

    // Generate per-cell base hues and phase offsets deterministically
    const cells = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const h1 = hash(`${seed}-${row}-${col}-hue`);
        const h2 = hash(`${seed}-${row}-${col}-phase`);
        const h3 = hash(`${seed}-${row}-${col}-active`);
        cells.push({
          baseHue: (h1 % 120) + 100,        // greens/teals: 100–220
          phase: (h2 % 1000) / 1000 * Math.PI * 2,
          active: h3 % 4 !== 0,             // ~75% of cells lit
          speed: 0.4 + (h2 % 100) / 200,    // per-cell animation speed
        });
      }
    }

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, size, size);

      // ── Clip to circle ──────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // ── Background ──────────────────────────────────────────────────────
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, size, size);

      // ── Pixel grid ──────────────────────────────────────────────────────
      cells.forEach((cell, i) => {
        if (!cell.active) return;
        const row = Math.floor(i / GRID);
        const col = i % GRID;
        const x = col * cellSize;
        const y = row * cellSize;

        const osc = reducedMotion
          ? 0.7
          : 0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase);

        const lightness = Math.round(25 + osc * 45); // 25–70%
        const alpha = 0.3 + osc * 0.7;

        ctx.fillStyle = `hsla(${cell.baseHue}, 80%, ${lightness}%, ${alpha})`;
        ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
      });

      ctx.restore();

      // ── Outer glow ──────────────────────────────────────────────────────
      const glow = ctx.createRadialGradient(
        size / 2, size / 2, size * 0.35,
        size / 2, size / 2, size / 2
      );
      glow.addColorStop(0, "rgba(22,163,74,0)");
      glow.addColorStop(1, "rgba(22,163,74,0.25)");
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    };

    if (reducedMotion) {
      draw(0);
      return;
    }

    // ── Animation loop ──────────────────────────────────────────────────────
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000; // seconds
      draw(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [seed, size]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Avatar for ${seed}`}
      style={{
        borderRadius: "50%",
        border: "2px solid rgba(22,163,74,.45)",
        flexShrink: 0,
        display: "block",
      }}
    />
  );
}
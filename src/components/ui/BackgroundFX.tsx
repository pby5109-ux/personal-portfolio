"use client";

/**
 * 全局背景特效：
 * 1. 三团缓慢漂移的渐变光晕（CSS 动画，GPU 友好）
 * 2. Canvas 星点粒子网络（数量自适应屏幕，标签页隐藏时暂停）
 * 3. 细噪点纹理层，增加「胶片质感」
 * 全部遵循 prefers-reduced-motion（减少动态时粒子静止）
 */
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tint: string;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制 dpr，避免高分屏性能损耗
    const LINK_DIST = 120;

    let w = 0;
    let h = 0;
    let raf = 0;
    let paused = false;
    let particles: Particle[] = [];

    const tints = ["165, 180, 252", "240, 171, 252", "196, 181, 253"];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 粒子数量随屏幕面积自适应，并设置上限
      const count = Math.min(85, Math.max(30, Math.floor((w * h) / 20000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.7,
        tint: tints[Math.floor(Math.random() * tints.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // 连线（距离小于阈值时）
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.13;
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // 星点
      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.tint}, 0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (!paused) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          // 边缘环绕
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        draw();
      }
      raf = requestAnimationFrame(step);
    };

    resize();
    draw(); // 首帧必画（reduced-motion 时保持静态画面）

    const onVisibility = () => {
      paused = document.hidden;
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduced) {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
      aria-hidden
    />
  );
}

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* 渐变光晕（暗色更明显，亮色更克制） */}
      <div className="absolute -top-36 -left-28 h-[34rem] w-[34rem] rounded-full bg-indigo-500/10 blur-[130px] animate-blob dark:bg-indigo-500/25" />
      <div className="absolute top-1/3 -right-44 h-[36rem] w-[36rem] rounded-full bg-purple-500/10 blur-[140px] animate-blob [animation-delay:-8s] dark:bg-purple-500/20" />
      <div className="absolute -bottom-44 left-1/4 h-[30rem] w-[30rem] rounded-full bg-pink-500/[0.07] blur-[130px] animate-blob [animation-delay:-14s] dark:bg-pink-500/15" />
      <ParticleCanvas />
      {/* 噪点 */}
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />
    </div>
  );
}

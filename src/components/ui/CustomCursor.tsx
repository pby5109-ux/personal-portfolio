"use client";

/**
 * 自定义光标：小圆点即时跟随 + 外圈惯性延迟跟随
 * - 仅在「精确指针」设备（桌面端）启用
 * - 悬停可交互元素时外圈放大、圆点缩小
 * - prefers-reduced-motion 时不启用
 */
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    setEnabled(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement | null;
      hovering = Boolean(
        target?.closest?.("a, button, input, textarea, select, label, [data-cursor-hover]")
      );
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${
        hovering ? 0.5 : 1
      })`;
    };

    const loop = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${
        hovering ? 1.7 : 1
      })`;
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* 中心小圆点 */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96] h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 opacity-0 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
      />
      {/* 惯性外圈 */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-9 w-9 rounded-full border border-purple-400/50 opacity-0"
      />
    </>
  );
}

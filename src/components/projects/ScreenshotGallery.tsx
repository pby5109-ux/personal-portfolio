"use client";

/**
 * 截图画廊 + 灯箱：点击缩略图放大查看，支持左右切换 / ESC 关闭
 */
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ScreenshotGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState<number | null>(null);

  const total = images.length;
  const close = () => setCurrent(null);
  const next = () => setCurrent((c) => (c === null ? c : (c + 1) % total));
  const prev = () => setCurrent((c) => (c === null ? c : (c - 1 + total) % total));

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  if (total === 0) return null;

  return (
    <>
      {/* 缩略图网格 */}
      <div className={cn("grid gap-4", total > 1 ? "sm:grid-cols-2" : "")}>
        {images.map((src, i) => (
          <motion.button
            key={src + i}
            type="button"
            onClick={() => setCurrent(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-[8/5] overflow-hidden rounded-2xl border border-line"
            aria-label={`放大查看截图 ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} 截图 ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
              <ZoomIn size={26} className="text-white" />
            </span>
          </motion.button>
        ))}
      </div>

      {/* 灯箱 */}
      <AnimatePresence>
        {current !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="截图预览"
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={close} aria-hidden />

            <AnimatePresence mode="wait">
              <motion.img
                key={images[current]}
                src={images[current]}
                alt={`${title} 截图 ${current + 1}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="relative max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={close}
              aria-label="关闭"
              className="glass-strong absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:rotate-90"
            >
              <X size={18} />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="上一张"
                  className="glass-strong absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="下一张"
                  className="glass-strong absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
                <span className="glass-strong absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 font-mono text-xs">
                  {current + 1} / {total}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

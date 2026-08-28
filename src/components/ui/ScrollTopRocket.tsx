"use client";

/**
 * 右下角「回到顶部」火箭按钮：
 * 下滑超过 560px 后出现，悬停时火箭喷「尾焰」并微微上浮
 */
import { AnimatePresence, motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollTopRocket() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 24, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="回到顶部"
          title="回到顶部 🚀"
          className="group glass-strong fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(168,85,247,0.5)]"
        >
          <Rocket
            size={20}
            className="text-purple-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-[-14deg] group-hover:text-pink-400"
          />
          {/* 尾焰 */}
          <span
            aria-hidden
            className="absolute bottom-1 h-2 w-5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-[3px] transition-all duration-300 group-hover:opacity-90"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

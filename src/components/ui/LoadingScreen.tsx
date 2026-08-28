"use client";

/**
 * 品牌加载过渡屏：
 * - 名字逐字模糊淡入 + 渐变进度条，约 1.8s 后整体上滑退场
 * - 同一会话（sessionStorage）只播放一次，避免来回切换页面重复打扰
 * - prefers-reduced-motion 时缩短为极简提示
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { site } from "@/data/site";

/* 客户端用 useLayoutEffect（在首帧绘制前读取 sessionStorage，避免闪屏），
   服务端渲染时回退为 useEffect 以消除警告 */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    // 同一会话只播放一次
    if (sessionStorage.getItem("intro-played")) return;
    setVisible(true);
    const timer = setTimeout(
      () => {
        setVisible(false);
        sessionStorage.setItem("intro-played", "1");
      },
      reduced ? 600 : 1900
    );
    return () => clearTimeout(timer);
  }, [reduced]);

  // 加载期间锁定页面滚动
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [visible]);

  const chars = Array.from(site.name);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          {/* 名字逐字入场 */}
          <div className="flex overflow-hidden pb-2" dir="ltr">
            {chars.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ y: 48, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.12 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-gradient px-[0.02em] text-4xl font-bold tracking-wide md:text-6xl"
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-3 text-xs font-medium uppercase tracking-[0.5em] text-muted"
          >
            Portfolio · 2026
          </motion.p>

          {/* 渐变进度条 */}
          <motion.div
            className="mt-9 h-[3px] w-44 overflow-hidden rounded-full bg-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduced ? 0.4 : 1.35, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

/**
 * 滚动入场动画容器：fade-in + slide-up，进入视口时触发一次
 * 供各板块统一使用，保证动画节奏一致
 */
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** 延迟（秒），用于做错落节奏 */
  delay?: number;
  /** 初始下移距离 */
  y?: number;
}

export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

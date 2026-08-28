"use client";

/**
 * 板块标题：编号眉标 + 大标题（可传渐变片段）+ 可选描述
 */
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** 编号，如 "01" */
  index?: string;
  /** 眉标文字，如 "关于我" */
  eyebrow: string;
  /** 大标题（可包含 <span className="text-gradient"> 渐变片段） */
  title: ReactNode;
  /** 描述 */
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const reduced = useReducedMotion();
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mb-14 md:mb-20", centered && "text-center")}
    >
      <div
        className={cn(
          "mb-4 flex items-center gap-3",
          centered && "justify-center"
        )}
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          {index ? `${index} · ` : ""}
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400" />
      </div>
      <h2 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      {description && (
        <p className={cn("mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base", centered && "mx-auto")}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

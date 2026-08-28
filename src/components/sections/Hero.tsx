"use client";

/**
 * Hero 首屏（100vh）：
 * - 名字逐字模糊淡入 + 身份词打字机轮播
 * - GSAP ScrollTrigger 视差：下滑时内容上移淡出
 * - 右侧 3D 陀螺仪装饰（CSS 3D，仅桌面端显示）
 * - 底部滚动提示箭头
 */
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { useTypewriter } from "@/hooks/useTypewriter";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const typed = useTypewriter(profile.roles);

  /* GSAP 视差：滚动离开首屏时内容上移 + 淡出 */
  useEffect(() => {
    if (reduced || !sectionRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -14,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 35%",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  const nameChars = Array.from(site.name);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
    >
      {/* 中央内容 */}
      <div ref={contentRef} className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-10 text-center md:px-8">
        {/* 身份徽章 */}
        <motion.span
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted md:text-sm"
        >
          {profile.badge}
        </motion.span>

        {/* 大标题（逐字入场） */}
        <h1 className="mt-7 text-4xl font-bold leading-[1.16] md:text-6xl lg:text-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="block text-foreground/90"
          >
            你好，我是
          </motion.span>
          <span className="mt-2 block" aria-label={site.name}>
            {nameChars.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-gradient inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* 打字机身份轮播 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6 flex h-8 items-center justify-center text-lg font-medium md:h-9 md:text-2xl"
        >
          <span className="text-muted">[你的专业] 毕业生 / </span>
          <span className="ml-1 text-foreground">{typed}</span>
          <span className="ml-0.5 inline-block h-[1.2em] w-[2px] animate-caret bg-gradient-to-b from-indigo-400 to-pink-400" aria-hidden />
        </motion.div>

        {/* 一句话介绍 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted md:text-base"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href={site.resumeUrl} download className="btn-gradient px-7 py-3.5 text-sm md:text-base">
            <Download size={17} />
            下载简历
          </a>
          <a
            href="#portfolio"
            className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/50 hover:shadow-[0_8px_32px_rgba(139,92,246,0.35)] md:text-base"
          >
            <Sparkles size={17} className="text-purple-300" />
            查看作品
          </a>
        </motion.div>

        {/* 社交链接 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300 hover:shadow-[0_6px_24px_rgba(139,92,246,0.4)]"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300 hover:shadow-[0_6px_24px_rgba(139,92,246,0.4)]"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`mailto:${site.socials.email}`}
            aria-label="邮箱"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300 hover:shadow-[0_6px_24px_rgba(139,92,246,0.4)]"
          >
            <Mail size={18} />
          </a>
        </motion.div>
      </div>

      {/* 右侧 3D 陀螺仪装饰（桌面端） */}
      <div className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 animate-float-slow lg:block" aria-hidden>
        <div className="relative h-80 w-80 [perspective:900px]">
          {/* 光晕核心 */}
          <div className="absolute inset-24 rounded-full bg-gradient-to-br from-indigo-400/80 to-pink-500/80 blur-2xl" />
          <div className="absolute inset-32 rounded-full bg-white/90 blur-md" />
          {/* 倾斜旋转环 1 */}
          <div className="absolute inset-4 [transform:rotateX(72deg)]">
            <div className="relative h-full w-full animate-spin-slower rounded-full border-2 border-purple-400/40">
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-pink-400 shadow-[0_0_14px_rgba(236,72,153,0.9)]" />
            </div>
          </div>
          {/* 倾斜旋转环 2（反向） */}
          <div className="absolute inset-10 [transform:rotateX(72deg)_rotateY(42deg)]">
            <div className="relative h-full w-full animate-spin-slower rounded-full border border-indigo-400/40 [animation-direction:reverse]">
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
            </div>
          </div>
          {/* 装饰点 */}
          <span className="absolute left-6 top-14 h-1.5 w-1.5 rounded-full bg-purple-300/80" />
          <span className="absolute bottom-10 right-8 h-2 w-2 rounded-full bg-pink-300/70" />
        </div>
      </div>

      {/* 底部滚动提示 */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-muted transition-colors hover:text-foreground"
        aria-label="向下滚动"
      >
        <span className="text-[11px] uppercase tracking-[0.35em]">Scroll</span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-line-strong p-1.5">
          <motion.span
            animate={reduced ? undefined : { y: [0, 11, 0], opacity: [1, 0.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-pink-400"
          />
        </span>
        <ArrowDown size={13} className="animate-pulse" />
      </motion.a>
    </section>
  );
}

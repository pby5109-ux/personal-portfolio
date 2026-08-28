"use client";

/**
 * 经历板块：垂直时间线
 * - 桌面端左右交替排列，移动端单侧排列
 * - 中间渐变线条由 GSAP ScrollTrigger 驱动「生长」动画
 * - 节点滚动进入视口时从对应侧滑入
 */
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Code2, GraduationCap, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { experiences, type ExperienceItem } from "@/data/experience";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** 经历类型 → 图标 */
const typeIcon: Record<ExperienceItem["type"], typeof Briefcase> = {
  education: GraduationCap,
  intern: Briefcase,
  project: Code2,
  award: Trophy,
};

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* GSAP：线条随滚动从 0 → 100% 生长 */
  useEffect(() => {
    if (reduced || !containerRef.current || !lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 68%",
            end: "bottom 58%",
            scrub: 0.4,
          },
        }
      );
      ScrollTrigger.refresh();
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section id="experience">
      <SectionHeading
        index="03"
        eyebrow="经历"
        title={
          <>
            我的<span className="text-gradient">成长轨迹</span>
          </>
        }
      />

      <div ref={containerRef} className="relative mx-auto max-w-4xl">
        {/* 时间线轨道（底色） */}
        <div
          aria-hidden
          className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-line md:left-1/2 md:-translate-x-px"
        />
        {/* 生长线条（GSAP 驱动） */}
        <div
          ref={lineRef}
          aria-hidden
          style={reduced ? undefined : { transform: "scaleY(0)" }}
          className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-[2px] origin-top bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 md:left-1/2 md:-translate-x-px"
        />

        {experiences.map((item, i) => {
          const Icon = typeIcon[item.type];
          const isLeft = i % 2 === 0; // 桌面端交替方向
          return (
            <div
              key={`${item.period}-${item.role}`}
              className="relative mb-10 pl-12 last:mb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
            >
              {/* 节点圆点 */}
              <span
                aria-hidden
                className="absolute left-[15px] top-8 z-10 -translate-x-1/2 md:left-1/2"
              >
                <span className="absolute inset-0 -m-1 rounded-full bg-purple-500/40 [animation:ping_2.6s_ease-out_infinite]" />
                <span className="block h-3.5 w-3.5 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 ring-4 ring-background" />
              </span>

              {/* 卡片（进入视口时从对应侧滑入） */}
              <motion.div
                initial={{ opacity: 0, x: reduced ? 0 : isLeft ? -40 : 40, y: reduced ? 0 : 12 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "glass rounded-3xl p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_14px_44px_rgba(139,92,246,0.22)]",
                  isLeft ? "md:col-start-1" : "md:col-start-2"
                )}
              >
                <div
                  className={cn(
                    "flex items-start gap-4",
                    isLeft && "md:flex-row-reverse md:text-right"
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-pink-500/25 text-purple-300">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-semibold text-gradient">{item.period}</span>
                    <h3 className="mt-1.5 text-lg font-bold leading-snug">{item.org}</h3>
                    <p className="mt-0.5 text-sm font-medium text-purple-300/90">{item.role}</p>
                  </div>
                </div>

                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed text-muted",
                    isLeft && "md:text-right"
                  )}
                >
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className={cn("mt-4 flex flex-wrap gap-2", isLeft && "md:justify-end")}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

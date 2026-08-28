"use client";

/**
 * 关于我板块：左照片（渐变边框 + 3D 悬浮）+ 右文字
 * 包含：自我介绍段落、数字滚动统计、兴趣标签
 */
import { motion, useReducedMotion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Tilt from "@/components/ui/Tilt";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

export default function About() {
  const reduced = useReducedMotion();
  const floatAnim = (duration: number, delay = 0) =>
    reduced ? undefined : { y: [0, -9, 0], transition: { repeat: Infinity, duration, delay, ease: "easeInOut" as const } };

  return (
    <Section id="about">
      <SectionHeading
        index="01"
        eyebrow="关于我"
        title={
          <>
            关于<span className="text-gradient">我</span>
          </>
        }
      />

      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* 左侧：个人照片 */}
        <Reveal className="relative mx-auto w-full max-w-sm">
          {/* 背景光晕 */}
          <div
            aria-hidden
            className="absolute -inset-5 rounded-[2.4rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-25 blur-2xl transition-opacity duration-500"
          />
          <Tilt max={6}>
            <div className="rounded-[1.9rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-[0_20px_60px_rgba(139,92,246,0.35)] transition-shadow duration-500 hover:shadow-[0_20px_70px_rgba(168,85,247,0.55)]">
              <img
                src={profile.avatar}
                alt={`${site.name} 的个人照片`}
                className="aspect-square w-full rounded-[1.8rem] object-cover"
                loading="lazy"
              />
            </div>
          </Tilt>

          {/* 悬浮徽章 */}
          <motion.div
            animate={floatAnim(4)}
            className="glass-strong absolute -right-3 top-8 rounded-2xl px-4 py-2.5 text-sm font-semibold md:-right-6"
          >
            🚀 Open to Work
          </motion.div>
          <motion.div
            animate={floatAnim(5, 1.2)}
            className="glass-strong absolute -left-3 bottom-12 rounded-2xl px-4 py-2.5 text-sm font-semibold md:-left-6"
          >
            ⭐ {profile.stats[2].value} 项获奖
          </motion.div>
        </Reveal>

        {/* 右侧：文字介绍 */}
        <div>
          {profile.about.map((para, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <p className="mb-4 text-sm leading-loose text-muted md:text-base">{para}</p>
            </Reveal>
          ))}

          {/* 关键数据（数字滚动） */}
          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {profile.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.08 * i}>
                <div className="glass group rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)]">
                  <div className="text-gradient text-2xl font-bold md:text-3xl">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1.5 text-xs text-muted">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 兴趣标签 */}
          <Reveal delay={0.15} className="mt-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted">兴趣 Interests</p>
            <div className="flex flex-wrap gap-2.5">
              {profile.interests.map((item) => (
                <span
                  key={item.label}
                  className="glass cursor-default rounded-full px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:shadow-[0_6px_20px_rgba(139,92,246,0.3)]"
                >
                  {item.emoji} {item.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

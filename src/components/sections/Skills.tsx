"use client";

/**
 * 技能板块：左右两栏
 * - 左：技术技能进度条（滚动到视口时从 0 填充到目标值，带流光）
 * - 右：软技能卡片 + 语言能力（圆点评分）+ 常用工具标签
 */
import { motion, useReducedMotion } from "framer-motion";
import { Code2, Languages, Lightbulb, MessageSquare, Sparkles, Users, Wrench, Clock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { languageSkills, softSkills, techSkills, tools } from "@/data/skills";
import { cn } from "@/lib/utils";

/** 软技能图标映射（数据文件里存的是图标名字符串） */
const softIcon = { Users, MessageSquare, Lightbulb, Clock } as const;

export default function Skills() {
  const reduced = useReducedMotion();

  return (
    <Section id="skills">
      <SectionHeading
        index="04"
        eyebrow="技能"
        title={
          <>
            技术<span className="text-gradient">栈</span>与能力
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左：技术技能进度条 */}
        <Reveal className="glass h-fit rounded-3xl p-7 md:p-9">
          <h3 className="flex items-center gap-2.5 text-lg font-bold">
            <Code2 size={20} className="text-purple-400" />
            技术技能
          </h3>
          <div className="mt-7 space-y-5">
            {techSkills.map((skill, i) => (
              <div key={skill.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="font-mono text-xs text-muted">{skill.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <motion.div
                    initial={{ width: reduced ? `${skill.level}%` : 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1.1, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  >
                    {/* 流光扫过效果 */}
                    {!reduced && (
                      <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer rounded-full bg-white/25 blur-[2px]" />
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* 右：软技能 + 语言 + 工具 */}
        <div className="flex flex-col gap-6">
          <Reveal delay={0.08} className="glass rounded-3xl p-7 md:p-9">
            <h3 className="flex items-center gap-2.5 text-lg font-bold">
              <Sparkles size={20} className="text-pink-400" />
              软技能
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {softSkills.map((s) => {
                const Icon = softIcon[s.icon];
                return (
                  <div
                    key={s.title}
                    className="glass rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-pink-500/25 text-purple-300">
                      <Icon size={19} />
                    </div>
                    <h4 className="mt-3 font-semibold">{s.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.14} className="glass rounded-3xl p-7 md:p-9">
            <h3 className="flex items-center gap-2.5 text-lg font-bold">
              <Languages size={20} className="text-indigo-400" />
              语言能力
            </h3>
            <div className="mt-5 space-y-4">
              {languageSkills.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs text-muted">{lang.note}</span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={reduced ? undefined : { opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
                        className={cn(
                          "h-2 w-8 origin-left rounded-full",
                          i < lang.level
                            ? "bg-gradient-to-r from-indigo-500 to-pink-500"
                            : "bg-line"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="mt-8 flex items-center gap-2.5 text-lg font-bold">
              <Wrench size={19} className="text-purple-400" />
              常用工具
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="glass cursor-default rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:text-purple-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

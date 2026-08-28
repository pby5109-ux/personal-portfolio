"use client";

/**
 * 作品集板块（核心）：
 * - 类别筛选（全部 / 前端 / 后端 / 设计 / 其他），切换带布局动画
 * - 卡片：3D 倾斜 + 鼠标跟随光影（Tilt 组件）
 * - 点击卡片 → 详情弹窗；「详情页」→ 独立子页面 /projects/[slug]
 * - 项目数据在 src/data/projects.ts 中维护
 */
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import ProjectCard from "@/components/sections/ProjectCard";
import ProjectModal from "@/components/sections/ProjectModal";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { projectCategories, projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type Category = (typeof projectCategories)[number];

export default function Portfolio() {
  const [filter, setFilter] = useState<Category>("全部");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(
    () => (filter === "全部" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <Section id="portfolio">
      <SectionHeading
        index="02"
        eyebrow="作品集"
        title={
          <>
            精选<span className="text-gradient">作品</span>
          </>
        }
        description="每个项目都从真实需求出发，注重工程质量与用户体验。点击卡片查看详情，或进入独立详情页了解更多。"
      />

      {/* 类别筛选 */}
      <Reveal className="mb-12 flex flex-wrap justify-center gap-2.5">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
              filter === cat
                ? "text-white"
                : "glass text-muted hover:-translate-y-0.5 hover:text-foreground"
            )}
          >
            {filter === cat && (
              <motion.span
                layoutId="portfolio-filter-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_4px_20px_rgba(139,92,246,0.45)]"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </Reveal>

      {/* 项目卡片网格 */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} onOpen={() => setSelected(project)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 项目详情弹窗 */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

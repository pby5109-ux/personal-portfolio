"use client";

/**
 * 项目卡片：
 * - 3D 倾斜 + 鼠标跟随光影（由 Tilt 组件提供）
 * - 封面 hover 缩放、标题箭头位移
 * - 点击打开详情弹窗；右下角「详情页」链接跳转独立子页面
 */
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Tilt from "@/components/ui/Tilt";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Tilt className="h-full rounded-3xl" max={7}>
        <div
          role="button"
          tabIndex={0}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen();
            }
          }}
          className="glass group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl [transform-style:preserve-3d] transition-[border-color,box-shadow] duration-500 hover:border-purple-400/40 hover:shadow-[0_18px_50px_rgba(139,92,246,0.25)]"
        >
          {/* 封面 */}
          <div className="relative aspect-[8/5] overflow-hidden">
            <img
              src={project.cover}
              alt={`${project.title} 封面`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden />
            <span className="glass-strong absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">
              {project.category}
            </span>
            <span className="absolute right-4 top-4 font-mono text-xs text-white/70">{project.year}</span>
          </div>

          {/* 内容（translateZ 让文字在 3D 倾斜时悬浮） */}
          <div className="flex flex-1 flex-col p-5 [transform:translateZ(22px)]">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-purple-300">
                {project.title}
              </h3>
              <ArrowUpRight
                size={18}
                className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-300"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.summary}</p>

            <div className="mt-auto flex items-end justify-between gap-2 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
              <Link
                href={`/projects/${project.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-xs font-medium text-purple-300 transition-colors hover:text-pink-300"
              >
                详情页 →
              </Link>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}

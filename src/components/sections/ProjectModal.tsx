"use client";

/**
 * 项目详情弹窗：
 * - 截图轮播（左右切换 + 指示点）
 * - 项目介绍 / 亮点 / 技术栈 / 外链 / 报告下载 / 独立详情页入口
 * - ESC 或点击遮罩关闭，打开时锁定页面滚动
 */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, FileDown, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [shot, setShot] = useState(0);

  /* 打开时：重置轮播、锁定滚动、监听 ESC */
  useEffect(() => {
    if (!project) return;
    setShot(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  const total = project?.screenshots.length ?? 0;
  const next = useCallback(() => setShot((s) => (s + 1) % total), [total]);
  const prev = useCallback(() => setShot((s) => (s - 1 + total) % total), [total]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} 详情`}
        >
          {/* 遮罩（点击关闭） */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />

          {/* 内容面板 */}
          <motion.div
            initial={{ opacity: 0, y: 44, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 44, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass-strong relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="glass-strong absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-90"
            >
              <X size={17} />
            </button>

            {/* 截图轮播 */}
            <div className="relative aspect-[8/5] w-full overflow-hidden rounded-t-3xl bg-black/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={project.screenshots[shot]}
                  src={project.screenshots[shot]}
                  alt={`${project.title} 截图 ${shot + 1}`}
                  initial={{ opacity: 0, x: 44 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -44 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="上一张"
                    className="glass-strong absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="下一张"
                    className="glass-strong absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110"
                  >
                    <ChevronRight size={18} />
                  </button>
                  {/* 指示点 */}
                  <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {project.screenshots.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setShot(i)}
                        aria-label={`查看第 ${i + 1} 张截图`}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          i === shot
                            ? "w-6 bg-gradient-to-r from-indigo-400 to-pink-400"
                            : "w-1.5 bg-white/40 hover:bg-white/70"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 文字内容 */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-purple-400/30 bg-gradient-to-r from-indigo-500/15 to-pink-500/15 px-3 py-1 text-xs font-medium text-purple-300">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-muted">{project.year}</span>
              </div>

              <h3 className="mt-3 text-2xl font-bold md:text-3xl">{project.title}</h3>

              {project.description.map((para, i) => (
                <p key={i} className="mt-4 text-sm leading-loose text-muted">
                  {para}
                </p>
              ))}

              {/* 项目亮点 */}
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* 技术栈 */}
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="glass rounded-full px-3.5 py-1.5 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* 链接区 */}
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links?.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gradient px-5 py-2.5 text-sm"
                  >
                    {link.label.toLowerCase() === "github" ? (
                      <GithubIcon className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight size={15} />
                    )}
                    {link.label}
                  </a>
                ))}

                {project.report && (
                  <a
                    href={project.report.url}
                    download
                    className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/50"
                  >
                    <FileDown size={15} className="text-purple-300" />
                    {project.report.label}
                  </a>
                )}

                <Link
                  href={`/projects/${project.slug}`}
                  className="glass inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:text-purple-300"
                >
                  独立详情页
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

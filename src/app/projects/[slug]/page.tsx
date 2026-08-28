/**
 * 作品详情子页面：/projects/[slug]
 * - 静态生成（SSG）：数据来自 src/data/projects.ts
 * - 包含：封面、截图画廊（灯箱）、介绍、亮点、技术栈、链接、上一/下一个项目导航
 */
import { ArrowLeft, ArrowRight, Check, ExternalLink, FileDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GithubIcon } from "@/components/ui/BrandIcons";
import Reveal from "@/components/ui/Reveal";
import ScreenshotGallery from "@/components/projects/ScreenshotGallery";
import { getProjectBySlug, projects } from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** 预生成所有项目详情页 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** 独立的 SEO 元信息 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "项目不存在" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.cover }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-10 md:px-8">
      {/* 返回 */}
      <Reveal>
        <Link
          href="/#portfolio"
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted transition-all hover:-translate-x-0.5 hover:text-foreground"
        >
          <ArrowLeft size={15} />
          返回作品集
        </Link>
      </Reveal>

      {/* 头部 */}
      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-purple-400/30 bg-gradient-to-r from-indigo-500/15 to-pink-500/15 px-3 py-1 text-xs font-medium text-purple-300">
            {project.category}
          </span>
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          {project.summary}
        </p>
      </Reveal>

      {/* 封面 */}
      <Reveal delay={0.1}>
        <div className="mt-8 overflow-hidden rounded-3xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.cover} alt={`${project.title} 封面`} className="aspect-[8/5] w-full object-cover" />
        </div>
      </Reveal>

      {/* 截图画廊 */}
      {project.screenshots.length > 0 && (
        <Reveal delay={0.1} className="mt-10">
          <h2 className="mb-5 text-xl font-bold">项目截图</h2>
          <ScreenshotGallery images={project.screenshots} title={project.title} />
        </Reveal>
      )}

      {/* 介绍 */}
      <Reveal delay={0.1} className="mt-12">
        <h2 className="mb-5 text-xl font-bold">项目介绍</h2>
        {project.description.map((para, i) => (
          <p key={i} className="mb-4 text-sm leading-loose text-muted md:text-base">
            {para}
          </p>
        ))}
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {/* 亮点 */}
        <Reveal>
          <h2 className="mb-5 text-xl font-bold">项目亮点</h2>
          <ul className="space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 技术栈 */}
        <Reveal delay={0.08}>
          <h2 className="mb-5 text-xl font-bold">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="glass rounded-full px-3.5 py-1.5 text-xs font-medium">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* 链接 */}
      <Reveal className="mt-10 flex flex-wrap gap-3">
        {project.links?.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient px-6 py-3 text-sm"
          >
            {link.label.toLowerCase() === "github" ? (
              <GithubIcon className="h-4 w-4" />
            ) : (
              <ExternalLink size={15} />
            )}
            {link.label}
          </a>
        ))}
        {project.report && (
          <a
            href={project.report.url}
            download
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/50"
          >
            <FileDown size={15} className="text-purple-300" />
            {project.report.label}
          </a>
        )}
      </Reveal>

      {/* 上一 / 下一个项目 */}
      <div className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
        <Link
          href={`/projects/${prev.slug}`}
          className="glass group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <ArrowLeft size={13} /> 上一个项目
          </span>
          <span className="mt-2 block font-semibold transition-colors group-hover:text-purple-300">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="glass group rounded-2xl p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
            下一个项目 <ArrowRight size={13} />
          </span>
          <span className="mt-2 block font-semibold transition-colors group-hover:text-purple-300">
            {next.title}
          </span>
        </Link>
      </div>
    </main>
  );
}

/**
 * 页脚：品牌信息、快捷导航、社交链接与版权信息
 */
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { footerText, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-line py-12">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* 品牌 */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-lg font-bold md:justify-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xs text-white">
                ✦
              </span>
              {site.name}
            </div>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">
              {site.nameEn} · 全栈开发者 · 用代码与设计创造有价值的产品
            </p>
          </div>

          {/* 快捷导航 */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            {site.navLinks.map((link) => (
              <a key={link.id} href={`/#${link.id}`} className="text-muted transition-colors hover:text-purple-300">
                {link.label}
              </a>
            ))}
          </nav>

          {/* 社交链接 */}
          <div className="flex items-center gap-3">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${site.socials.email}`}
              aria-label="邮箱"
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted md:flex-row">
          <span>{footerText.copyright}</span>
          <span>{footerText.builtWith} · Next.js × Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}

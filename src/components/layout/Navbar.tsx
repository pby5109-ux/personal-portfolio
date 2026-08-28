"use client";

/**
 * 固定导航栏：
 * - 顶部透明，滚动后变为毛玻璃
 * - 桌面端：锚点链接（当前板块高亮，滑块动画）+ 主题 / 音乐开关 + 下载简历
 * - 移动端：汉堡按钮 → 全屏覆盖菜单（圆形裁切展开动画）
 */
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MusicToggle from "@/components/ui/MusicToggle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { site } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const navIds = site.navLinks.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const active = useActiveSection(navIds);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 移动端菜单打开时锁定滚动
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  /** 在首页直接用锚点；在子页面则先回到首页对应板块 */
  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass-strong py-2.5" : "bg-transparent py-4"
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 text-lg font-bold" onClick={() => setMenuOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-sm text-white shadow-[0_0_18px_rgba(139,92,246,0.5)] transition-transform duration-500 group-hover:rotate-[20deg]">
              ✦
            </span>
            <span className="transition-colors duration-300 group-hover:text-purple-300">{site.name}</span>
          </Link>

          {/* 桌面端锚点导航 */}
          <div className="hidden items-center gap-1 lg:flex">
            {site.navLinks.map((link) => {
              const isActive = isHome && active === link.id;
              return (
                <a
                  key={link.id}
                  href={hrefFor(link.id)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="glass absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2.5">
            <MusicToggle />
            <ThemeToggle />
            <a href={site.resumeUrl} download className="btn-gradient hidden px-5 py-2 text-sm lg:inline-flex">
              <Download size={15} />
              下载简历
            </a>
            {/* 汉堡按钮（移动端） */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-transform hover:scale-110 lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* 移动端全屏覆盖菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="导航菜单"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-lg font-bold">{site.name}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="关闭菜单"
                className="glass flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-2 px-8">
              {site.navLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={hrefFor(link.id)}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-2xl px-6 py-4 text-center text-2xl font-bold transition-colors hover:bg-white/5 hover:text-purple-300"
                >
                  <span className="mr-3 font-mono text-sm text-purple-400">0{i + 1}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pb-10 text-center"
            >
              <a href={site.resumeUrl} download className="btn-gradient px-8 py-3.5 text-sm">
                <Download size={16} />
                下载简历
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

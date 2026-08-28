"use client";

/**
 * 深色 / 浅色主题切换按钮（默认深色）
 * 状态持久化在 localStorage，由 layout.tsx 中的内联脚本在首屏前应用
 */
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // null = 尚未挂载到浏览器（服务端与首次客户端渲染一致，避免水合警告）
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !(dark ?? true);
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* 隐私模式下忽略 */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
      title="切换主题"
      className="glass flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all duration-300 hover:scale-110 hover:text-foreground"
    >
      {dark === null ? (
        <span className="h-4 w-4" />
      ) : dark ? (
        <Moon size={16} />
      ) : (
        <Sun size={16} />
      )}
    </button>
  );
}

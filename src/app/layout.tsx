import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";

import { site } from "@/data/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundFX from "@/components/ui/BackgroundFX";
import LoadingScreen from "@/components/ui/LoadingScreen";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollTopRocket from "@/components/ui/ScrollTopRocket";
import { JsonLd } from "@/components/ui/JsonLd";

/* ---------------- SEO 元信息 & Open Graph ---------------- */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["个人作品集", "前端开发", "全栈开发", "简历", site.name],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: `${site.name} 的个人网站`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f5fa" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * 主题初始化脚本：在首屏渲染前读取 localStorage 中的主题设置，
 * 避免亮色用户看到「闪白 → 变暗」的跳变（默认暗色）。
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":true;var el=document.documentElement;el.classList.toggle("dark",dark);el.classList.toggle("light",!dark);}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* 结构化数据（SEO） */}
        <JsonLd />
      </head>
      <body className="relative min-h-screen overflow-x-clip">
        <LoadingScreen />
        <BackgroundFX />
        <CustomCursor />
        <Navbar />
        {/* 为固定导航栏留出内容偏移 */}
        <div className="relative pt-16">{children}</div>
        <Footer />
        <ScrollTopRocket />
      </body>
    </html>
  );
}

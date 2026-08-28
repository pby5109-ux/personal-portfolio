/**
 * ============================================================
 * 站点全局配置（导航 / 社交链接 / SEO / 简历地址 / 音乐等）
 * 👉 替换内容：全局搜索 [你的名字] / yourname / your-domain 等占位符
 * ============================================================
 */

/** 导航锚点（id 对应各板块 section 的 id） */
export interface NavLink {
  id: string;
  label: string;
}

export const site = {
  /** 你的名字（导航 Logo、Hero 大标题、页脚等处会用到） */
  name: "[你的名字]",
  /** 英文名 / 拼音（用于英文排版装饰） */
  nameEn: "[Your Name]",
  /** 浏览器标签页标题 */
  title: "[你的名字] · 全栈开发者 | 个人作品集",
  /** SEO 描述 */
  description:
    "[你的名字] 的个人作品集网站：[你的专业] 应届毕业生、全栈开发者。展示项目作品、个人经历、技能与简历，期待与你交流。",
  /** 你的站点线上地址（用于 SEO / Open Graph，部署后改成真实域名） */
  url: "https://your-domain.vercel.app",

  /** 导航栏锚点链接（顺序即展示顺序） */
  navLinks: [
    { id: "about", label: "关于我" },
    { id: "portfolio", label: "作品集" },
    { id: "experience", label: "经历" },
    { id: "skills", label: "技能" },
    { id: "files", label: "文件" },
    { id: "contact", label: "联系" },
  ] as NavLink[],

  /** 社交链接（微信走二维码弹窗） */
  socials: {
    github: "https://github.com/yourname", // 👉 替换成你的 GitHub 主页
    linkedin: "https://www.linkedin.com/in/yourname", // 👉 替换成你的 LinkedIn
    email: "hello@example.com", // 👉 替换成你的邮箱
    wechatQr: "/images/wechat-qr.svg", // 👉 替换成你的微信二维码图片
  },

  /** 简历 PDF 地址：可指向 public/files/ 下的文件，或 Supabase Storage 的公开链接 */
  resumeUrl: "/files/resume.pdf",

  /** 背景音乐（可选）：填入 mp3 链接后，导航栏会出现音乐开关；留空则隐藏 */
  music: {
    url: "", // 例如 "/audio/bgm.mp3" 或外链
    title: "背景音乐",
  },
} as const;

/** 页脚文案 */
export const footerText = {
  copyright: `© ${new Date().getFullYear()} ${site.name} · 保留所有权利`,
  builtWith: `Built with ❤️ by ${site.name}`,
};

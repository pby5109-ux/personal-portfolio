/**
 * ============================================================
 * 站点全局配置（导航 / 社交链接 / SEO / 简历地址 / 音乐等）
 * ============================================================
 */

/** 导航锚点（id 对应各板块 section 的 id） */
export interface NavLink {
  id: string;
  label: string;
}

export const site = {
  /** 你的名字（导航 Logo、Hero 大标题、页脚等处会用到） */
  name: "彭博裕",
  /** 英文名 / 拼音（用于英文排版装饰） */
  nameEn: "Boyu Peng",
  /** 浏览器标签页标题 */
  title: "彭博裕 · 嵌入式软件工程师 | 个人作品集",
  /** SEO 描述 */
  description:
    "彭博裕的个人作品集网站：山东建筑大学物联网工程 2027 届本科生，具备 STM32/FreeRTOS 项目开发、软硬件联调与故障定位经历。展示项目作品、个人经历、技能与简历，期待与你交流。",
  /** 你的站点线上地址（用于 SEO / Open Graph） */
  url: "https://personal-portfolio-mu-henna-76.vercel.app",

  /** 导航栏锚点链接（顺序即展示顺序） */
  navLinks: [
    { id: "about", label: "关于我" },
    { id: "portfolio", label: "作品集" },
    { id: "experience", label: "经历" },
    { id: "skills", label: "技能" },
    { id: "files", label: "文件" },
    { id: "contact", label: "联系" },
  ] as NavLink[],

  /** 社交链接（微信走二维码弹窗；linkedin 留空则全站隐藏该图标） */
  socials: {
    github: "https://github.com/pby5109-ux",
    linkedin: "",
    email: "1174035686@qq.com",
    wechatQr: "/images/wechat-qr.jpg",
  },

  /** 简历 PDF 地址：导航栏、Hero、文件板块的下载按钮共用（嵌入式软件工程师版） */
  resumeUrl: "/files/resume.pdf",

  /** 背景音乐（可选）：填入 mp3 链接后，导航栏会出现音乐开关；留空则隐藏 */
  music: {
    url: "",
    title: "背景音乐",
  },
} as const;

/** 页脚文案 */
export const footerText = {
  copyright: `© ${new Date().getFullYear()} ${site.name} · 保留所有权利`,
  builtWith: `Built with ❤️ by ${site.name}`,
};

/**
 * ============================================================
 * 技能数据（Skills 板块）
 * 👉 level 为百分比进度条（0-100），按真实水平填写即可
 * ============================================================
 */

/** 技术技能（左侧进度条） */
export interface TechSkill {
  name: string;
  level: number;
}

export const techSkills: TechSkill[] = [
  { name: "JavaScript / TypeScript", level: 90 },
  { name: "React / Next.js", level: 88 },
  { name: "HTML / CSS / Tailwind", level: 92 },
  { name: "Python", level: 78 },
  { name: "Node.js", level: 75 },
  { name: "SQL / 数据库", level: 70 },
];

/** 软技能（右侧卡片，icon 对应 lucide-react 图标名） */
export interface SoftSkill {
  icon: "Users" | "MessageSquare" | "Lightbulb" | "Clock";
  title: string;
  desc: string;
}

export const softSkills: SoftSkill[] = [
  {
    icon: "Users",
    title: "团队协作",
    desc: "曾带领 6 人小组完成多个项目，熟悉 Git 协作与 Code Review 流程。",
  },
  {
    icon: "MessageSquare",
    title: "沟通表达",
    desc: "有竞赛答辩与实习汇报经验，能把技术方案讲给非技术同学听懂。",
  },
  {
    icon: "Lightbulb",
    title: "学习能力",
    desc: "保持每周阅读源码 / 文档的习惯，新框架上手速度快。",
  },
  {
    icon: "Clock",
    title: "时间管理",
    desc: "课业、项目、实习并行推进，擅长拆解目标与优先级管理。",
  },
];

/** 语言能力（右侧圆点评分，满分 5） */
export const languageSkills = [
  { name: "中文（普通话）", level: 5, note: "母语" },
  { name: "英语", level: 4, note: "CET-6 · 可流畅阅读英文文档" },
];

/** 常用工具标签 */
export const tools = [
  "Git",
  "VS Code",
  "Figma",
  "Docker",
  "Linux",
  "Postman",
  "Vercel",
  "Supabase",
];

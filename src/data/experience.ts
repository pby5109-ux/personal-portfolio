/**
 * ============================================================
 * 经历时间线数据（Experience 板块）
 * 👉 替换成你的真实经历：教育经历 + 实习 / 项目 / 获奖等
 * type 可选："education" | "intern" | "project" | "award"（决定节点图标）
 * ============================================================
 */

export interface ExperienceItem {
  period: string;
  org: string;
  role: string;
  type: "education" | "intern" | "project" | "award";
  description: string;
  tags?: string[];
}

export const experiences: ExperienceItem[] = [
  {
    period: "2025.06 - 2025.09",
    org: "[某互联网公司]",
    role: "前端开发实习生",
    type: "intern",
    description:
      "参与 [核心业务线] 的前端开发与维护，独立负责 3 个需求模块的迭代上线；推动团队落地组件按需加载与首屏优化，页面 LCP 从 2.8s 降至 1.4s。获得实习期「优秀实习生」评价。",
    tags: ["React", "性能优化", "企业级项目"],
  },
  {
    period: "2024.03 - 2024.12",
    org: "[校园技术工作室]",
    role: "前端组组长",
    type: "project",
    description:
      "带领 6 人前端小组完成 3 个校内系统的开发与维护；建立组内技术分享机制（每两周一次），组织新人从 0 到 1 学习 React 并上手真实项目。",
    tags: ["团队管理", "技术分享", "Next.js"],
  },
  {
    period: "2023.10",
    org: "[「互联网+」创新创业大赛]",
    role: "省级二等奖",
    type: "award",
    description:
      "作为团队技术负责人，完成参赛项目「[智能校园服务平台]」的全栈开发与现场答辩，从 300+ 支队伍中突围，获省级二等奖。",
    tags: ["全栈开发", "竞赛答辩"],
  },
  {
    period: "2022.09 - 2026.06",
    org: "[你的大学]",
    role: "计算机科学与技术 · 本科",
    type: "education",
    description:
      "主修数据结构、操作系统、计算机网络、数据库原理等核心课程，GPA [3.8/4.0]（专业前 [10%]）。课余自学前端与设计，多次获得校级奖学金。",
    tags: ["GPA 3.8", "校级奖学金"],
  },
];

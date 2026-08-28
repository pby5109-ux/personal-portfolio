/**
 * ============================================================
 * 作品集数据（Portfolio 板块 + 作品详情子页面）
 * 👉 替换成你的真实项目：改字段即可，卡片 / 弹窗 / 详情页会自动生成
 *
 * category 只能取："前端" | "后端" | "设计" | "其他"
 * cover / screenshots 支持本地路径（public/ 下）或任意 https 图片链接
 * ============================================================
 */

export type ProjectCategory = "前端" | "后端" | "设计" | "其他";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  /** 唯一标识（决定详情页地址 /projects/[slug]），建议用英文短横线命名 */
  slug: string;
  title: string;
  /** 一句话简介（卡片上展示，约 2 行以内） */
  summary: string;
  category: ProjectCategory;
  year: string;
  /** 封面图 */
  cover: string;
  /** 截图轮播（详情弹窗 & 详情页展示） */
  screenshots: string[];
  /** 详细介绍（多段） */
  description: string[];
  /** 项目亮点列表 */
  highlights: string[];
  /** 技术标签 */
  tech: string[];
  /** 外部链接：GitHub / 在线演示等 */
  links?: ProjectLink[];
  /** 相关文件下载（如项目报告 PDF），没有可省略 */
  report?: { label: string; url: string };
}

export const projects: Project[] = [
  {
    slug: "aura-dashboard",
    title: "Aura · 实时数据可视化大屏",
    summary:
      "面向物联网场景的实时监控大屏，支持万级数据点流畅渲染与自定义拖拽布局。",
    category: "前端",
    year: "2025",
    cover: "/images/cover-1.svg",
    screenshots: ["/images/shot-1.svg", "/images/shot-5.svg", "/images/cover-1.svg"],
    description: [
      "Aura 是我为 [某实习公司 / 课程设计] 开发的实时数据可视化大屏。系统接入 WebSocket 实时数据流，在 4K 分辨率下稳定渲染 1 万+ 动态数据点，并支持按业务场景自由拖拽、缩放图表组件。",
      "项目中我主导了渲染性能优化：通过虚拟化列表、Canvas 分层绘制与请求节流，将首屏渲染时间从 3.2s 降至 800ms 内；同时封装了 20+ 可复用的图表组件，让业务同事可以零代码搭建自己的监控视图。",
    ],
    highlights: [
      "WebSocket 实时推送，数据延迟 < 1s",
      "万级数据点流畅渲染（Canvas 分层 + 节流）",
      "拖拽式自定义布局，配置实时保存",
      "封装 20+ 图表组件，支持主题切换",
    ],
    tech: ["React", "TypeScript", "ECharts", "WebSocket", "Zustand"],
    links: [
      { label: "GitHub", url: "https://github.com/yourname/aura-dashboard" },
      { label: "在线演示", url: "https://your-demo-link.com" },
    ],
  },
  {
    slug: "suiji-ai-notes",
    title: "随记 · AI 摘要笔记服务",
    summary:
      "基于大模型的笔记后端服务，自动生成文章摘要与标签，QPS 峰值 500+。",
    category: "后端",
    year: "2025",
    cover: "/images/cover-2.svg",
    screenshots: ["/images/shot-2.svg", "/images/shot-1.svg"],
    description: [
      "随记是一个面向内容创作者的智能笔记服务。后端接收用户上传的长文，调用大模型 API 自动生成摘要、提取关键词标签，并提供全文检索能力。",
      "我负责整体架构设计：采用 FastAPI + PostgreSQL + Redis 的组合，通过异步任务队列削峰、接口幂等设计保证稳定性，压测下 QPS 峰值 500+，P99 延迟 180ms。项目使用 Docker Compose 一键部署，并编写了完整的接口文档。",
    ],
    highlights: [
      "异步任务队列处理大模型调用，避免请求阻塞",
      "PostgreSQL + pgvector 实现语义检索",
      "Redis 缓存热点数据，P99 延迟 180ms",
      "Docker Compose 一键部署 + 完整 API 文档",
    ],
    tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    links: [{ label: "GitHub", url: "https://github.com/yourname/suiji-api" }],
    report: { label: "设计文档（示例 PDF）", url: "/files/project-report-demo.pdf" },
  },
  {
    slug: "campus-market",
    title: "校园二手交易平台",
    summary:
      "服务全校学生的二手交易 Web 应用，上线三个月注册用户 2000+。",
    category: "前端",
    year: "2024",
    cover: "/images/cover-3.svg",
    screenshots: ["/images/shot-3.svg", "/images/shot-5.svg", "/images/shot-2.svg"],
    description: [
      "这是一个我和两位同学一起做的校园项目：从需求调研、原型设计到开发上线全流程参与。平台支持商品发布、站内私信、信用评价与失物招领板块。",
      "我主要负责前端架构与核心页面开发，落地了图片懒加载、无限滚动、骨架屏等体验优化；同时推动团队引入 Git Flow 与 Code Review 流程，保证三个人的协作质量。",
    ],
    highlights: [
      "上线 3 个月注册用户 2000+，日均活跃 150+",
      "Next.js SSR 首屏优化，Lighthouse 性能分 92",
      "移动端优先的响应式设计",
      "建立团队 Git 协作与 Code Review 规范",
    ],
    tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
    links: [
      { label: "GitHub", url: "https://github.com/yourname/campus-market" },
      { label: "在线演示", url: "https://your-demo-link.com" },
    ],
  },
  {
    slug: "monogram-brand",
    title: "Monogram · 个人品牌视觉设计",
    summary:
      "为个人 IP 完成的整套品牌视觉：Logo、配色系统、排版规范与社交媒体模板。",
    category: "设计",
    year: "2024",
    cover: "/images/cover-4.svg",
    screenshots: ["/images/shot-4.svg", "/images/cover-4.svg"],
    description: [
      "这是我自己运营的个人 IP 项目中完成的一套品牌视觉。从 Logo 草图、栅格推敲，到配色系统、字体层级与社交媒体模板，形成了一套可以长期复用的 VI 规范。",
      "整个过程让我更深入地理解了「设计系统」的思维：统一的设计 Token 让后续所有物料都能快速产出，并且保持风格一致。这套经验也直接迁移到了我写前端组件库的实践中。",
    ],
    highlights: [
      "完整 VI：Logo / 配色 / 字体 / 图形系统",
      "输出 Figma 组件库，物料产出效率提升 3 倍",
      "社交平台模板累计曝光 10w+",
    ],
    tech: ["Figma", "Illustrator", "Photoshop", "品牌设计"],
    links: [{ label: "设计稿预览", url: "https://your-figma-link.com" }],
  },
  {
    slug: "smart-timetable",
    title: "智能课表小程序",
    summary:
      "支持拍照导入课表、四六级倒计时与考试提醒的校园工具小程序，用户 5000+。",
    category: "其他",
    year: "2023",
    cover: "/images/cover-5.svg",
    screenshots: ["/images/shot-5.svg", "/images/shot-1.svg"],
    description: [
      "一款解决「每学期手抄课表」痛点的小工具：拍照上传课表截图后，OCR 自动识别并生成结构化课表，还提供四六级倒计时、考试日程提醒等附加功能。",
      "独立完成产品、设计与开发全流程。期间踩过的最有意思的坑是 OCR 识别不同教务系统截图样式的适配——最终通过模板匹配 + 规则引擎组合，把识别准确率从 76% 提升到 95%。",
    ],
    highlights: [
      "OCR 拍照导入课表，识别准确率 95%",
      "订阅消息考试提醒，次日留存 40%",
      "累计用户 5000+，应用商店评分 4.8",
    ],
    tech: ["微信小程序", "云开发", "OCR", "Node.js"],
    links: [{ label: "项目仓库", url: "https://github.com/yourname/smart-timetable" }],
  },
  {
    slug: "pulse-whiteboard",
    title: "Pulse · 实时协作白板",
    summary:
      "多人实时协作白板，支持画笔、便签、框选与光标同步，延迟 < 50ms。",
    category: "前端",
    year: "2024",
    cover: "/images/cover-6.svg",
    screenshots: ["/images/shot-6.svg", "/images/shot-3.svg"],
    description: [
      "Pulse 是我研究 CRDT 与协同编辑时做的实验性项目：多人可以在同一块白板上同时绘制、贴便签，彼此的光标实时可见，冲突由 CRDT 自动合并。",
      "技术上采用 Canvas 渲染 + WebSocket 增量同步，通过操作合并与防抖把同步带宽降低了 70%。这个项目让我对分布式一致性与实时通信有了远超课本的理解。",
    ],
    highlights: [
      "基于 CRDT 的冲突自动合并，离线可用",
      "操作合并 + 防抖，同步带宽降低 70%",
      "多光标实时同步，端到端延迟 < 50ms",
    ],
    tech: ["React", "Canvas", "Socket.IO", "Yjs", "Node.js"],
    links: [{ label: "GitHub", url: "https://github.com/yourname/pulse-whiteboard" }],
  },
];

/** 作品集筛选类别（「全部」+ 数据中出现的类别自动聚合） */
export const projectCategories = ["全部", "前端", "后端", "设计", "其他"] as const;

/** 根据 slug 查找项目 */
export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

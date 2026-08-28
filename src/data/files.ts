/**
 * ============================================================
 * 文件 & 简历板块数据
 * ============================================================
 */

export const filesConfig = {
  /**
   * Supabase Storage 的 bucket 名称（需要在 Supabase 控制台创建，
   * 步骤见 README「Supabase 配置指南」）
   */
  bucket: "portfolio-files",

  /** 上传文件的存放目录（bucket 内的路径前缀） */
  folder: "files",

  /** 单个文件大小上限（MB） */
  maxSizeMB: 20,

  /** 允许上传的文件类型（留空 [] 表示不限制） */
  accept: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg", ".webp", ".zip", ".md"],
};

/**
 * 演示文件：未配置 Supabase 时展示这些占位文件，
 * 让访客也能看到文件卡片的完整效果。
 */
export interface DemoFile {
  name: string;
  size: number; // 字节
  date: string; // ISO 时间
  url: string;
}

export const demoFiles: DemoFile[] = [
  {
    name: "个人简历.pdf",
    size: 931,
    date: "2026-08-20T10:00:00+08:00",
    url: "/files/resume.pdf",
  },
  {
    name: "项目报告（示例）.pdf",
    size: 901,
    date: "2026-08-15T18:30:00+08:00",
    url: "/files/project-report-demo.pdf",
  },
];

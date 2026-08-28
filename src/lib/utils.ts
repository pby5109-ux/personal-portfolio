/**
 * 通用工具函数
 */

/** 拼接 className（极简版 clsx） */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** 字节数 → 可读的文件大小 */
export function formatBytes(bytes: number) {
  if (!bytes || bytes < 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

/** ISO 时间 → 「2026.08.20」 */
export function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

export type FileKind = "image" | "pdf" | "doc" | "archive" | "other";

/** 根据文件名判断类型（决定文件卡片图标与预览方式） */
export function fileKind(name: string): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "md", "txt", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "doc";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  return "other";
}

/** 文件大小校验 */
export function isSizeOk(file: File, maxSizeMB: number) {
  return file.size <= maxSizeMB * 1024 * 1024;
}

"use client";

/**
 * 文件卡片：按类型显示图标，支持预览与下载
 */
import { Download, Eye, File, FileArchive, FileText, Image as ImageIcon } from "lucide-react";
import type { FileKind } from "@/lib/utils";
import { formatDate, formatBytes } from "@/lib/utils";

export interface DisplayFile {
  name: string;
  size: number | null;
  date: string | null;
  url: string;
  kind: FileKind;
}

/** 文件类型 → 图标与配色 */
const kindMeta: Record<FileKind, { Icon: typeof File; color: string; label: string }> = {
  image: { Icon: ImageIcon, color: "text-sky-300 bg-sky-400/10", label: "图片" },
  pdf: { Icon: FileText, color: "text-pink-300 bg-pink-400/10", label: "PDF" },
  doc: { Icon: FileText, color: "text-indigo-300 bg-indigo-400/10", label: "文档" },
  archive: { Icon: FileArchive, color: "text-amber-300 bg-amber-400/10", label: "压缩包" },
  other: { Icon: File, color: "text-muted bg-white/5", label: "文件" },
};

export default function FileCard({
  file,
  onPreview,
}: {
  file: DisplayFile;
  onPreview: () => void;
}) {
  const meta = kindMeta[file.kind];
  const { Icon } = meta;
  // 图片 / PDF 支持在线预览，其他类型只能下载
  const previewable = file.kind === "image" || file.kind === "pdf";

  return (
    <div className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white/[0.03] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:shadow-[0_8px_28px_rgba(139,92,246,0.18)]">
      {/* 类型图标 */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.color}`}>
        <Icon size={20} />
      </div>

      {/* 文件信息 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={file.name}>
          {file.name}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {meta.label}
          {file.size != null && ` · ${formatBytes(file.size)}`}
          {file.date && ` · ${formatDate(file.date)}`}
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex shrink-0 items-center gap-1.5">
        {previewable && (
          <button
            type="button"
            onClick={onPreview}
            aria-label={`预览 ${file.name}`}
            title="在线预览"
            className="glass flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all duration-300 hover:scale-110 hover:text-purple-300"
          >
            <Eye size={15} />
          </button>
        )}
        <a
          href={file.url}
          download={file.name}
          aria-label={`下载 ${file.name}`}
          title="下载"
          className="glass flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all duration-300 hover:scale-110 hover:text-pink-300"
        >
          <Download size={15} />
        </a>
      </div>
    </div>
  );
}

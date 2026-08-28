"use client";

/**
 * 文件在线预览弹窗：图片直接显示，PDF 用内嵌 iframe，其他类型提示下载
 */
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useEffect } from "react";
import type { DisplayFile } from "@/components/files/FileCard";

interface FilePreviewModalProps {
  file: DisplayFile | null;
  onClose: () => void;
}

export default function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [file, onClose]);

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${file.name} 预览`}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="glass-strong relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <p className="truncate text-sm font-semibold">{file.name}</p>
              <div className="flex items-center gap-2">
                <a
                  href={file.url}
                  download={file.name}
                  className="btn-gradient px-4 py-1.5 text-xs"
                >
                  <Download size={13} />
                  下载
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="关闭预览"
                  className="glass flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:rotate-90"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* 预览内容 */}
            <div className="min-h-0 flex-1 overflow-auto bg-black/30 p-3 md:p-5">
              {file.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.url} alt={file.name} className="mx-auto max-h-[72vh] rounded-xl object-contain" />
              ) : file.kind === "pdf" ? (
                <iframe
                  src={file.url}
                  title={file.name}
                  className="h-[72vh] w-full rounded-xl bg-white"
                />
              ) : (
                <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-muted">
                  <p className="text-sm">该文件类型暂不支持在线预览</p>
                  <a href={file.url} download={file.name} className="btn-gradient px-5 py-2.5 text-sm">
                    <Download size={15} />
                    下载查看
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

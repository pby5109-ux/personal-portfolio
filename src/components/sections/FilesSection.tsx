"use client";

/**
 * 文件 & 简历板块（核心功能）：
 * - 简历下载卡片
 * - 拖拽 / 点击上传（简单密码保护，密码在 .env.local 的 NEXT_PUBLIC_UPLOAD_PASSWORD 配置）
 * - 上传到 Supabase Storage，带真实进度条（XHR 实现）
 * - 文件列表：来自 Supabase；未配置时展示演示文件（网站功能不受影响）
 * - 支持在线预览（图片 / PDF）与下载
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  CloudUpload,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import FileCard, { type DisplayFile } from "@/components/files/FileCard";
import FilePreviewModal from "@/components/files/FilePreviewModal";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { demoFiles, filesConfig } from "@/data/files";
import { site } from "@/data/site";
import { getSupabase, isSupabaseConfigured, uploadWithProgress } from "@/lib/supabase";
import { fileKind, isSizeOk } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UploadTask {
  id: string;
  name: string;
  percent: number;
  status: "uploading" | "done" | "error";
}

interface Toast {
  id: number;
  text: string;
  ok: boolean;
}

/** 演示文件 → 展示结构 */
const demoDisplayFiles: DisplayFile[] = demoFiles.map((f) => ({
  name: f.name,
  size: f.size,
  date: f.date,
  url: f.url,
  kind: fileKind(f.name),
}));

export default function FilesSection() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");

  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [remoteFiles, setRemoteFiles] = useState<DisplayFile[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [preview, setPreview] = useState<DisplayFile | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /** 轻量 toast 提示，3.2s 后自动消失 */
  const toast = useCallback((text: string, ok = true) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, ok }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  /* 从 sessionStorage 恢复解锁状态（当前会话内有效） */
  useEffect(() => {
    setUnlocked(sessionStorage.getItem("upload-unlocked") === "1");
  }, []);

  /** 从 Supabase 拉取文件列表 */
  const loadFiles = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoadingList(true);
    const { data, error } = await sb.storage
      .from(filesConfig.bucket)
      .list(filesConfig.folder, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      toast(`读取文件列表失败：${error.message}`, false);
    } else if (data) {
      setRemoteFiles(
        data
          .filter((f) => f.name && !f.name.startsWith("."))
          .map((f) => {
            const { data: urlData } = sb.storage
              .from(filesConfig.bucket)
              .getPublicUrl(`${filesConfig.folder}/${f.name}`);
            return {
              name: f.name,
              size: f.metadata?.size ?? null,
              date: f.created_at ?? null,
              url: urlData.publicUrl,
              kind: fileKind(f.name),
            } satisfies DisplayFile;
          })
      );
    }
    setLoadingList(false);
  }, [toast]);

  useEffect(() => {
    if (isSupabaseConfigured) void loadFiles();
  }, [loadFiles]);

  /** 上传处理（校验 → XHR 带进度上传 → 刷新列表） */
  const onFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const sb = getSupabase();
      if (!sb) {
        toast("尚未配置 Supabase Storage，无法上传（配置步骤见 README）", false);
        return;
      }

      for (const file of Array.from(fileList)) {
        if (!isSizeOk(file, filesConfig.maxSizeMB)) {
          toast(`「${file.name}」超过 ${filesConfig.maxSizeMB}MB 大小限制`, false);
          continue;
        }
        if (
          filesConfig.accept.length > 0 &&
          !filesConfig.accept.some((ext) => file.name.toLowerCase().endsWith(ext))
        ) {
          toast(`不支持的文件类型：${file.name}`, false);
          continue;
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setUploads((u) => [...u, { id, name: file.name, percent: 0, status: "uploading" }]);

        // 文件名净化 + 时间戳前缀防覆盖
        const safeName = file.name.replace(/[^\w.\-\u4e00-\u9fa5]+/g, "_");
        const path = `${filesConfig.folder}/${Date.now()}_${safeName}`;

        try {
          await uploadWithProgress(file, path, (percent) =>
            setUploads((u) => u.map((t) => (t.id === id ? { ...t, percent } : t)))
          );
          setUploads((u) => u.map((t) => (t.id === id ? { ...t, percent: 100, status: "done" } : t)));
          toast(`「${file.name}」上传成功 🎉`);
          void loadFiles();
          // 完成后 2.5s 移除该进度条
          setTimeout(() => setUploads((u) => u.filter((t) => t.id !== id)), 2500);
        } catch (err) {
          const message = err instanceof Error ? err.message : "未知错误";
          setUploads((u) => u.filter((t) => t.id !== id));
          toast(`「${file.name}」上传失败：${message}`, false);
        }
      }
    },
    [loadFiles, toast]
  );

  /** 密码解锁（前端简单校验，防止随意上传） */
  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_UPLOAD_PASSWORD || "admin123";
    if (password === expected) {
      setUnlocked(true);
      sessionStorage.setItem("upload-unlocked", "1");
      setPwError("");
      toast("已解锁上传功能 ✨");
    } else {
      setPwError("密码不正确");
    }
  };

  const files: DisplayFile[] = isSupabaseConfigured ? remoteFiles : demoDisplayFiles;

  return (
    <Section id="files">
      <SectionHeading
        index="05"
        eyebrow="文件与简历"
        title={
          <>
            文件 & <span className="text-gradient">简历</span>
          </>
        }
        description="这里可以下载我的简历与项目资料；上传区域供站长维护使用。"
      />

      {/* 简历卡片（渐变描边） */}
      <Reveal>
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-[0_16px_50px_rgba(139,92,246,0.3)]">
          <div className="relative flex flex-col items-start justify-between gap-6 rounded-[calc(1.5rem-1.5px)] bg-background-soft p-7 md:flex-row md:items-center md:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl"
            />
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white shadow-lg">
                <FileText size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold">我的简历</h3>
                <p className="mt-1 text-sm text-muted">PDF 格式 · 教育经历 / 技能栈 / 项目经验</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={site.resumeUrl} download className="btn-gradient px-6 py-3 text-sm">
                <Download size={16} />
                下载简历
              </a>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/50"
              >
                <Eye size={16} />
                在线查看
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        {/* 上传区 */}
        <Reveal className="glass h-fit rounded-3xl p-7">
          <h3 className="flex items-center gap-2.5 text-lg font-bold">
            <CloudUpload size={20} className="text-purple-400" />
            上传文件
          </h3>

          {!isSupabaseConfigured && (
            <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs leading-relaxed text-amber-300">
              ⚠️ 尚未配置 Supabase Storage，上传功能暂不可用，下方展示演示文件。
              配置步骤见项目 README。
            </p>
          )}

          {!unlocked ? (
            /* 密码解锁表单 */
            <form onSubmit={unlock} className="mt-5">
              <label htmlFor="upload-password" className="text-xs text-muted">
                上传功能已加密保护，输入管理密码解锁：
              </label>
              <div className="mt-2.5 flex gap-2">
                <div className="relative flex-1">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="upload-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="管理密码"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-line bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-purple-400/60"
                  />
                </div>
                <button type="submit" className="btn-gradient px-5 py-2.5 text-sm">
                  解锁
                </button>
              </div>
              {pwError && (
                <motion.p
                  initial={{ x: 0 }}
                  animate={reducedMotionSafeShake()}
                  className="mt-2 text-xs text-red-400"
                >
                  {pwError}，请重试
                </motion.p>
              )}
            </form>
          ) : (
            /* 拖拽上传区 */
            <div
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void onFiles(e.dataTransfer.files);
              }}
              className={cn(
                "mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center outline-none transition-all duration-300",
                dragOver
                  ? "scale-[1.01] border-purple-400 bg-purple-400/10"
                  : "border-line-strong hover:border-purple-400/60 hover:bg-white/[0.03]"
              )}
            >
              <motion.div
                animate={dragOver ? { y: [-2, 2, -2] } : { y: 0 }}
                transition={dragOver ? { repeat: Infinity, duration: 0.7 } : { duration: 0.3 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-pink-500/25 text-purple-300"
              >
                <CloudUpload size={26} />
              </motion.div>
              <p className="mt-4 text-sm font-semibold">拖拽文件到这里，或点击选择</p>
              <p className="mt-1.5 text-xs text-muted">
                支持 {filesConfig.accept.slice(0, 5).join(" / ")} 等格式 · 单个不超过 {filesConfig.maxSizeMB}MB
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  void onFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          )}

          {/* 上传进度条 */}
          {uploads.length > 0 && (
            <div className="mt-4 space-y-3">
              <AnimatePresence>
                {uploads.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-line bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate font-medium">{task.name}</span>
                      {task.status === "uploading" && (
                        <span className="shrink-0 font-mono text-muted">{task.percent}%</span>
                      )}
                      {task.status === "done" && (
                        <span className="flex shrink-0 items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={13} /> 完成
                        </span>
                      )}
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        animate={{ width: `${task.percent}%` }}
                        transition={{ duration: 0.15 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Reveal>

        {/* 文件列表 */}
        <Reveal delay={0.08} className="glass rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2.5 text-lg font-bold">
              <FolderOpen size={20} className="text-pink-400" />
              文件列表
              {!isSupabaseConfigured && (
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  演示数据
                </span>
              )}
            </h3>
            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={() => void loadFiles()}
                title="刷新列表"
                aria-label="刷新文件列表"
                className="glass flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:text-foreground"
              >
                <RefreshCw size={14} className={loadingList ? "animate-spin" : undefined} />
              </button>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {files.map((f) => (
              <FileCard key={`${f.name}-${f.url}`} file={f} onPreview={() => setPreview(f)} />
            ))}
            {files.length === 0 && (
              <p className="py-10 text-center text-sm text-muted">
                {loadingList ? "加载中…" : "暂无文件，去上传第一个吧 📁"}
              </p>
            )}
          </div>
        </Reveal>
      </div>

      {/* 预览弹窗 */}
      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />

      {/* Toast 提示 */}
      <div className="pointer-events-none fixed bottom-7 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className={cn(
                "glass-strong max-w-[86vw] truncate rounded-full px-5 py-2.5 text-sm",
                t.ok ? "text-emerald-300" : "text-red-300"
              )}
              role="status"
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}

/** 密码错误时的轻微摇晃动画（尊重减少动态设置时不动） */
function reducedMotionSafeShake() {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { x: 0 };
  }
  return { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } };
}

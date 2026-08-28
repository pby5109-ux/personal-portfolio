"use client";

/**
 * 联系板块：
 * - 联系表单（姓名 / 邮箱 / 留言），提交后播放成功动画
 *   · 配置 NEXT_PUBLIC_FORMSPREE_ENDPOINT 后真实发送；否则模拟成功演示
 * - 社交链接：GitHub / LinkedIn / 邮箱 / 微信（二维码弹窗）
 */
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, Mail, MapPin, Send, X } from "lucide-react";
import { useState } from "react";
import { GithubIcon, LinkedinIcon, WechatIcon } from "@/components/ui/BrandIcons";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success";

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<typeof initialForm>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const set = (key: keyof typeof initialForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时忽略 */
    }
  };

  const validate = () => {
    const err: Partial<typeof initialForm> = {};
    if (!form.name.trim()) err.name = "请填写你的称呼";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "邮箱格式不正确";
    if (form.message.trim().length < 5) err.message = "留言至少 5 个字";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle" || !validate()) return;
    setStatus("sending");
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    try {
      if (endpoint) {
        // 真实发送（Formspree / 自建接口均可）
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // 未配置接口：模拟发送延迟（演示用）
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("success");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 4200);
    } catch {
      setStatus("idle");
      alert("发送失败，请稍后重试或直接发邮件给我 🙏");
    }
  };

  const inputClass = (hasError?: string) =>
    cn(
      "w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60",
      hasError ? "border-red-400/70" : "border-line focus:border-purple-400/60"
    );

  return (
    <Section id="contact">
      <SectionHeading
        index="06"
        eyebrow="联系方式"
        title={
          <>
            联系<span className="text-gradient">我</span>
          </>
        }
        description="无论是工作机会、项目合作，还是单纯想交流技术，都欢迎随时联系我。"
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        {/* 左：联系信息 */}
        <div>
          <Reveal>
            <p className="text-sm leading-loose text-muted md:text-base">
              通常我会在 <span className="font-semibold text-foreground">24 小时内</span> 回复邮件。
              也可以通过下面的社交渠道找到我，微信扫码即可添加好友。
            </p>
          </Reveal>

          {/* 邮箱（可复制） */}
          <Reveal delay={0.08}>
            <div className="glass mt-6 flex items-center justify-between gap-3 rounded-2xl p-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-pink-500/25 text-purple-300">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-xs text-muted">邮箱</p>
                  <p className="text-sm font-medium">{site.socials.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="复制邮箱"
                title="复制邮箱"
                className="glass flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all hover:scale-110 hover:text-purple-300"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </Reveal>

          {/* 所在地 */}
          <Reveal delay={0.14}>
            <div className="glass mt-3 flex items-center gap-3.5 rounded-2xl p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-pink-500/25 text-purple-300">
                <MapPin size={18} />
              </span>
              <div>
                <p className="text-xs text-muted">坐标</p>
                <p className="text-sm font-medium">[你的城市] · 可远程协作</p>
              </div>
            </div>
          </Reveal>

          {/* 社交链接 */}
          <Reveal delay={0.2} className="mt-6 flex gap-3">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300 hover:shadow-[0_8px_26px_rgba(139,92,246,0.4)]"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300 hover:shadow-[0_8px_26px_rgba(139,92,246,0.4)]"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              aria-label="查看微信二维码"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-emerald-300 hover:shadow-[0_8px_26px_rgba(52,211,153,0.35)]"
            >
              <WechatIcon className="h-5 w-5" />
            </button>
            <a
              href={`mailto:${site.socials.email}`}
              aria-label="发送邮件"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-muted transition-all duration-300 hover:-translate-y-1 hover:text-purple-300 hover:shadow-[0_8px_26px_rgba(139,92,246,0.4)]"
            >
              <Mail size={19} />
            </a>
          </Reveal>
        </div>

        {/* 右：联系表单 */}
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} noValidate className="glass rounded-3xl p-7 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs font-medium text-muted">
                  你的称呼 *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="张三"
                  className={inputClass(errors.name)}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs font-medium text-muted">
                  邮箱 *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className={inputClass(errors.email)}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message" className="mb-2 block text-xs font-medium text-muted">
                留言内容 *
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={set("message")}
                rows={5}
                placeholder="想聊点什么…（合作机会 / 项目交流 / 随便聊聊）"
                className={cn(inputClass(errors.message), "resize-none")}
              />
              {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className={cn(
                "btn-gradient mt-6 w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-80 md:text-base",
                status === "success" &&
                  "bg-none bg-emerald-500/90 shadow-[0_8px_30px_rgba(52,211,153,0.4)]"
              )}
            >
              {status === "idle" && (
                <>
                  <Send size={16} />
                  发送消息
                </>
              )}
              {status === "sending" && (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  发送中…
                </>
              )}
              {status === "success" && (
                <>
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="flex"
                  >
                    <Check size={17} />
                  </motion.span>
                  已收到！我会在 24 小时内回复 ✨
                </>
              )}
            </button>

            {!process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT && (
              <p className="mt-3 text-center text-[11px] leading-relaxed text-muted/80">
                当前为演示模式（未配置表单接口）。在 .env.local 配置
                NEXT_PUBLIC_FORMSPREE_ENDPOINT 后即可真实收信。
              </p>
            )}
          </form>
        </Reveal>
      </div>

      {/* 底部一句话 */}
      <Reveal delay={0.1} className="mt-20 text-center">
        <p className="text-gradient text-3xl font-bold md:text-5xl">期待与你的交流 ☕</p>
      </Reveal>

      {/* 微信二维码弹窗 */}
      <AnimatePresence>
        {qrOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="微信二维码"
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setQrOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="glass-strong relative w-full max-w-xs rounded-3xl p-7 text-center"
            >
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                aria-label="关闭"
                className="glass absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:rotate-90"
              >
                <X size={15} />
              </button>
              <WechatIcon className="mx-auto h-10 w-10 text-emerald-400" />
              <h3 className="mt-3 text-lg font-bold">微信联系我</h3>
              <p className="mt-1 text-xs text-muted">打开微信扫一扫，添加好友</p>
              {/* 二维码（替换 public/images/wechat-qr.svg 为你的真实二维码） */}
              <div className="mx-auto mt-5 w-full max-w-[220px] overflow-hidden rounded-2xl bg-white p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={site.socials.wechatQr} alt="微信二维码" className="w-full rounded-xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

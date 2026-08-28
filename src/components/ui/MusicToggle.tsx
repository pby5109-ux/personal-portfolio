"use client";

/**
 * 背景音乐开关（可选功能）
 * 在 src/data/site.ts 的 music.url 填入音频地址后自动显示，留空则隐藏（默认关闭）
 */
import { Music, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // 未配置音频链接时直接隐藏
  const enabled = Boolean(site.music.url);
  useEffect(() => {
    setPlaying(false);
  }, [enabled]);

  if (!enabled) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        /* 浏览器自动播放策略拦截时忽略 */
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "关闭背景音乐" : "播放背景音乐"}
      title={site.music.title}
      className={`glass flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${
        playing ? "text-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.45)]" : "text-muted hover:text-foreground"
      }`}
    >
      {playing ? <Music size={16} className="animate-pulse" /> : <VolumeX size={16} />}
      {site.music.url && <audio ref={audioRef} src={site.music.url} loop preload="none" />}
    </button>
  );
}

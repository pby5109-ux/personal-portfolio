/**
 * GSAP 统一注册出口（只能在客户端组件中引入）
 * 用法：import { gsap, ScrollTrigger } from "@/lib/gsap";
 */
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

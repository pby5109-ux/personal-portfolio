import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许 next/image 加载任意 https 远程图片（方便直接使用 Supabase / 图床链接）
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

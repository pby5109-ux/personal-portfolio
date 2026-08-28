/**
 * Supabase 客户端（用于「文件 & 简历」板块的存储能力）
 *
 * 环境变量（见 .env.example）：
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * 未配置时 isSupabaseConfigured 为 false，
 * 文件板块会自动降级为「演示模式」，网站其他功能不受影响。
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/** 懒加载的单例客户端（仅在浏览器端使用） */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

/**
 * 使用 XMLHttpRequest 上传文件到 Supabase Storage，
 * 从而获得真实的上传进度（supabase-js 原生 upload 不支持进度回调）
 */
export function uploadWithProgress(
  file: File,
  path: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${supabaseUrl}/storage/v1/object/${path}`);
    xhr.setRequestHeader("apikey", supabaseAnonKey);
    xhr.setRequestHeader("authorization", `Bearer ${supabaseAnonKey}`);
    // 同名文件覆盖
    xhr.setRequestHeader("x-upsert", "true");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status < 300) resolve();
      else {
        let msg = `上传失败（HTTP ${xhr.status}）`;
        try {
          msg = JSON.parse(xhr.responseText).message ?? msg;
        } catch {
          /* 忽略解析失败 */
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("网络错误，上传失败"));
    xhr.send(file);
  });
}

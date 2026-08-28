/**
 * ============================================================
 * 占位资源生成脚本（无需任何第三方依赖，仅用 Node 内置模块）
 * 运行：npm run generate:assets
 * 作用：生成项目封面、截图、头像、微信二维码、OG 图、网站图标、示例 PDF
 * 说明：这些均为「占位素材」，上线前请替换成你的真实图片 / 简历
 * ============================================================
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG = join(ROOT, "public", "images");
const FILES = join(ROOT, "public", "files");
const APP = join(ROOT, "src", "app");
mkdirSync(IMG, { recursive: true });
mkdirSync(FILES, { recursive: true });
mkdirSync(APP, { recursive: true });

/* ======================= PNG 编码器 ======================= */
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
/** pixelFn(x, y) => [r, g, b, a] */
function encodePng(width, height, pixelFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let p = 0;
  for (let y = 0; y < height; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      raw[p++] = r; raw[p++] = g; raw[p++] = b; raw[p++] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ======================= 颜色工具 ======================= */
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));

/* ======================= 1. 网站图标 icon.png ======================= */
{
  const W = 128, bg1 = hex("#6366f1"), bg2 = hex("#ec4899");
  const png = encodePng(W, W, (x, y) => {
    // 圆角矩形蒙版（半径 30）
    const cx = Math.min(x, W - 1 - x), cy = Math.min(y, W - 1 - y);
    if (cx < 30 && cy < 30) {
      const d = Math.hypot(30 - cx, 30 - cy);
      if (d > 30) return [0, 0, 0, 0];
    }
    const t = (x + y) / (2 * W);
    let [r, g, b] = mix(bg1, bg2, t);
    // 白色四角星（主）
    const star = (px, py, size) => {
      const dx = Math.abs(x - px), dy = Math.abs(y - py);
      const m = Math.max(dx, dy), n = Math.min(dx, dy);
      return m <= size && n <= 7.5 * (1 - (m / size) ** 3);
    };
    if (star(62, 66, 40) || star(100, 28, 14)) return [255, 255, 255, 255];
    return [r, g, b, 255];
  });
  writeFileSync(join(APP, "icon.png"), png);
  console.log("✓ src/app/icon.png");
}

/* ======================= 2. OG 分享图 og.png ======================= */
{
  const W = 1200, H = 630, base = hex("#0a0a0f");
  const blobs = [
    { x: 300, y: 190, r: 520, c: hex("#6366f1"), k: 0.62 },
    { x: 860, y: 250, r: 560, c: hex("#a855f7"), k: 0.55 },
    { x: 620, y: 580, r: 470, c: hex("#ec4899"), k: 0.5 },
  ];
  const png = encodePng(W, H, (x, y) => {
    let [r, g, b] = base;
    for (const bl of blobs) {
      const d2 = (x - bl.x) ** 2 + (y - bl.y) ** 2;
      const a = bl.k * Math.exp(-d2 / (2 * (bl.r / 2.1) ** 2));
      r += bl.c[0] * a; g += bl.c[1] * a; b += bl.c[2] * a;
    }
    // 暗角
    const edge = Math.min(x, y, W - x, H - y);
    const v = 1 - 0.4 * Math.max(0, 1 - edge / 260);
    return [clamp255(r * v), clamp255(g * v), clamp255(b * v), 255];
  });
  writeFileSync(join(ROOT, "public", "og.png"), png);
  console.log("✓ public/og.png");
}

/* ======================= 3. 示例 PDF（简历 / 项目报告占位） ======================= */
function makePdf(title, lines) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const content =
    "BT\n/F1 22 Tf\n1 0 0 1 72 730 Tm\n(" + esc(title) + ") Tj\nET\n" +
    "BT\n/F1 11 Tf\n1 0 0 1 72 690 Tm\n16 TL\n" +
    lines.map((l) => "(" + esc(l) + ") Tj T*").join("\n") +
    "\nET";
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Length " + Buffer.byteLength(content) + " >>\nstream\n" + content + "\nendstream",
  ];
  let out = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((body, i) => {
    offsets.push(Buffer.byteLength(out));
    out += (i + 1) + " 0 obj\n" + body + "\nendobj\n";
  });
  const xref = Buffer.byteLength(out);
  out += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
  offsets.forEach((o) => { out += String(o).padStart(10, "0") + " 00000 n \n"; });
  out += "trailer\n<< /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
  return Buffer.from(out, "latin1");
}
writeFileSync(join(FILES, "resume.pdf"), makePdf("[Your Name] - Resume (Placeholder)", [
  "This is a PLACEHOLDER resume used for local preview only.",
  "Replace it with your real resume PDF:",
  "  Option A: overwrite  public/files/resume.pdf  with your own file.",
  "  Option B: upload your resume to Supabase Storage and update",
  "            resumeUrl in  src/data/site.ts .",
  "",
  "Education : [Your University] - [Your Major] (2022 - 2026)",
  "Skills     : JavaScript / TypeScript / React / Next.js / Python ...",
  "Contact    : your-email@example.com",
]));
writeFileSync(join(FILES, "project-report-demo.pdf"), makePdf("Project Report (Demo File)", [
  "This demo PDF is used to preview the file card / download feature.",
  "Upload your own reports to Supabase Storage to replace it.",
]));
console.log("✓ public/files/resume.pdf + project-report-demo.pdf");

/* ======================= 4. 项目封面 cover-1..6.svg ======================= */
const covers = [
  { c1: "#6366f1", c2: "#22d3ee", glyph: "</>" },
  { c1: "#10b981", c2: "#14b8a6", glyph: "{ }" },
  { c1: "#ec4899", c2: "#8b5cf6", glyph: "♥" },
  { c1: "#f59e0b", c2: "#f43f5e", glyph: "◆" },
  { c1: "#0ea5e9", c2: "#6366f1", glyph: "01" },
  { c1: "#8b5cf6", c2: "#d946ef", glyph: "✦" },
];
covers.forEach((cv, i) => {
  const n = i + 1;
  // XML 转义（避免 "</>" 之类的字形破坏 SVG 解析）
  const glyph = cv.glyph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="ui-monospace,monospace">
  <defs>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${cv.c1}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${cv.c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${cv.c2}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${cv.c2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${cv.c1}"/><stop offset="100%" stop-color="${cv.c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="#0d0d17"/>
  <circle cx="640" cy="90" r="320" fill="url(#g1)"/>
  <circle cx="120" cy="460" r="300" fill="url(#g2)"/>
  <path d="M0 125H800 M0 250H800 M0 375H800 M200 0V500 M400 0V500 M600 0V500" stroke="#ffffff" stroke-opacity="0.05"/>
  <rect x="470" y="270" width="220" height="140" rx="18" fill="none" stroke="${cv.c1}" stroke-opacity="0.55" stroke-width="2" transform="rotate(-8 580 340)"/>
  <circle cx="180" cy="120" r="60" fill="none" stroke="${cv.c2}" stroke-opacity="0.6" stroke-width="2" stroke-dasharray="6 8"/>
  <circle cx="250" cy="380" r="5" fill="${cv.c2}" opacity="0.9"/>
  <circle cx="700" cy="430" r="4" fill="${cv.c1}" opacity="0.9"/>
  <circle cx="90" cy="300" r="3" fill="#ffffff" opacity="0.5"/>
  <path d="M60 60 L120 60" stroke="url(#ln)" stroke-width="4" stroke-linecap="round"/>
  <text x="400" y="300" font-size="180" font-weight="bold" fill="#ffffff" fill-opacity="0.08" text-anchor="middle">${glyph}</text>
</svg>`;
  writeFileSync(join(IMG, `cover-${n}.svg`), svg);
});
console.log("✓ public/images/cover-1..6.svg");

/* ======================= 5. 截图占位 shot-1..6.svg（浏览器窗口风格） ======================= */
const shots = [
  { c1: "#6366f1", c2: "#22d3ee", kind: "dash" },
  { c1: "#10b981", c2: "#14b8a6", kind: "code" },
  { c1: "#ec4899", c2: "#8b5cf6", kind: "cards" },
  { c1: "#f59e0b", c2: "#f43f5e", kind: "brand" },
  { c1: "#0ea5e9", c2: "#6366f1", kind: "mobile" },
  { c1: "#8b5cf6", c2: "#d946ef", kind: "board" },
];
function windowFrame(inner) {
  return `<rect x="0" y="0" width="800" height="500" rx="14" fill="#0d0d17"/>
  <rect x="0" y="0" width="800" height="38" rx="14" fill="#161627"/>
  <rect x="0" y="24" width="800" height="14" fill="#161627"/>
  <circle cx="24" cy="19" r="6" fill="#ff5f57"/><circle cx="44" cy="19" r="6" fill="#febc2e"/><circle cx="64" cy="19" r="6" fill="#28c840"/>
  <rect x="90" y="9" width="620" height="20" rx="10" fill="#0d0d17"/>
  ${inner}`;
}
const bar = (x, y, w, c, o = 0.85) => `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="${c}" opacity="${o}"/>`;
shots.forEach((s, i) => {
  const n = i + 1;
  let body = "";
  if (s.kind === "dash") {
    body = `
    <rect x="0" y="38" width="150" height="462" fill="#111120"/>
    ${[70, 130, 190, 250, 310].map((y) => bar(24, y, 100, "#3a3a5c", 0.7)).join("")}
    ${[0, 1, 2].map((k) => `<rect x="${180 + k * 200}" y="70" width="170" height="90" rx="12" fill="#161627"/><rect x="${196 + k * 200}" y="90" width="70" height="9" rx="4" fill="#3a3a5c"/><rect x="${196 + k * 200}" y="112" width="${90 + k * 18}" height="14" rx="6" fill="url(#ln)"/>`).join("")}
    <rect x="180" y="190" width="370" height="260" rx="12" fill="#161627"/>
    ${[60, 95, 45, 120, 80, 140, 100].map((h, k) => `<rect x="${210 + k * 46}" y="${425 - h}" width="26" height="${h}" rx="6" fill="${k % 2 ? s.c2 : s.c1}" opacity="0.9"/>`).join("")}
    <rect x="580" y="190" width="190" height="260" rx="12" fill="#161627"/>
    <polyline points="600,400 640,350 680,370 720,300 750,260" fill="none" stroke="${s.c2}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="750" cy="260" r="6" fill="${s.c2}"/>`;
  } else if (s.kind === "code") {
    body = `
    <rect x="60" y="70" width="420" height="380" rx="12" fill="#111120"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<rect x="84" y="${100 + k * 34}" width="14" height="8" rx="3" fill="#2c2c4a"/><rect x="110" y="${100 + k * 34}" width="${[180, 240, 120, 260, 90, 200, 150, 220, 110, 170][k]}" height="8" rx="4" fill="${k % 3 === 0 ? s.c1 : k % 3 === 1 ? "#3a3a5c" : s.c2}" opacity="0.9"/>`).join("")}
    <rect x="510" y="70" width="230" height="180" rx="12" fill="#161627"/><rect x="530" y="95" width="120" height="10" rx="5" fill="${s.c1}"/><rect x="530" y="120" width="180" height="8" rx="4" fill="#3a3a5c"/><rect x="530" y="140" width="160" height="8" rx="4" fill="#3a3a5c"/><rect x="530" y="160" width="190" height="8" rx="4" fill="#3a3a5c"/>
    <rect x="510" y="270" width="230" height="180" rx="12" fill="#161627"/><circle cx="625" cy="345" r="46" fill="none" stroke="${s.c2}" stroke-width="6" stroke-dasharray="200 90" stroke-linecap="round"/><text x="625" y="352" font-size="20" fill="#e2e8f0" text-anchor="middle" font-family="ui-monospace,monospace">98%</text>`;
  } else if (s.kind === "cards") {
    body = `
    ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `
    <rect x="${60 + c * 240}" y="${70 + r * 135}" width="210" height="110" rx="12" fill="#161627"/>
    <rect x="${78 + c * 240}" y="${88 + r * 135}" width="64" height="48" rx="8" fill="${(r + c) % 2 ? s.c2 : s.c1}" opacity="0.85"/>
    ${bar(78 + 78 * 0 + 78 + c * 240 - 78, 0, 0, "#000", 0)}
    <rect x="${152 + c * 240}" y="${92 + r * 135}" width="100" height="9" rx="4" fill="#e2e8f0" opacity="0.75"/>
    <rect x="${152 + c * 240}" y="${112 + r * 135}" width="80" height="7" rx="3.5" fill="#3a3a5c"/>
    <rect x="${78 + c * 240}" y="${148 + r * 135}" width="120" height="7" rx="3.5" fill="#3a3a5c"/>`).join("")).join("")}`;
  } else if (s.kind === "brand") {
    body = `
    <circle cx="200" cy="200" r="90" fill="none" stroke="url(#ln)" stroke-width="10"/>
    <rect x="300" y="120" width="160" height="160" rx="40" fill="${s.c1}" opacity="0.85"/>
    <path d="M560 280 L640 120 L720 280 Z" fill="none" stroke="${s.c2}" stroke-width="8"/>
    ${[0, 1, 2, 3, 4].map((k) => `<rect x="${60 + k * 68}" y="340" width="52" height="52" rx="12" fill="${["#f59e0b", "#f43f5e", "#0d0d17", "#3a3a5c", "#e2e8f0"][k]}"/>`).join("")}
    ${bar(440, 360, 300, "#3a3a5c", 0.9)}${bar(440, 385, 240, "#3a3a5c", 0.9)}${bar(440, 410, 280, "#3a3a5c", 0.9)}`;
  } else if (s.kind === "mobile") {
    body = `
    ${[0, 1, 2].map((k) => `
    <rect x="${110 + k * 220}" y="70" width="180" height="380" rx="26" fill="#111120" stroke="#2c2c4a" stroke-width="2"/>
    <rect x="${128 + k * 220}" y="100" width="144" height="110" rx="12" fill="${k % 2 ? s.c2 : s.c1}" opacity="0.85"/>
    ${[0, 1, 2, 3].map((r) => `<rect x="${128 + k * 220}" y="${230 + r * 42}" width="144" height="30" rx="8" fill="#161627"/>`).join("")}
    <rect x="${158 + k * 220}" y="${410}" width="84" height="24" rx="12" fill="url(#ln)"/>`).join("")}`;
  } else {
    body = `
    <path d="M250 160 C 350 80, 480 90, 560 170" fill="none" stroke="#3a3a5c" stroke-width="2" stroke-dasharray="5 7"/>
    <path d="M270 330 C 380 390, 460 380, 540 310" fill="none" stroke="#3a3a5c" stroke-width="2" stroke-dasharray="5 7"/>
    <rect x="90" y="110" width="150" height="110" rx="8" fill="${s.c1}" opacity="0.9" transform="rotate(-4 165 165)"/>
    <rect x="560" y="120" width="150" height="110" rx="8" fill="${s.c2}" opacity="0.9" transform="rotate(5 635 175)"/>
    <rect x="120" y="290" width="150" height="110" rx="8" fill="#f59e0b" opacity="0.75" transform="rotate(3 195 345)"/>
    <rect x="545" y="260" width="150" height="110" rx="8" fill="#10b981" opacity="0.75" transform="rotate(-5 620 315)"/>
    <circle cx="410" cy="240" r="55" fill="#161627" stroke="#3a3a5c"/>
    <text x="410" y="250" font-size="26" text-anchor="middle" fill="#e2e8f0" font-family="ui-monospace,monospace">✦</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="ui-sans-serif,system-ui">
  <defs>
    <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${s.c1}"/><stop offset="100%" stop-color="${s.c2}"/>
    </linearGradient>
  </defs>
  ${windowFrame(body)}
</svg>`;
  writeFileSync(join(IMG, `shot-${n}.svg`), svg);
});
console.log("✓ public/images/shot-1..6.svg");

/* ======================= 6. 头像占位 avatar.svg ======================= */
writeFileSync(join(IMG, "avatar.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#312e81"/><stop offset="55%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="480" height="480" fill="url(#bg)"/>
  <circle cx="90" cy="90" r="150" fill="#ffffff" opacity="0.06"/>
  <circle cx="410" cy="400" r="180" fill="#ffffff" opacity="0.05"/>
  <circle cx="240" cy="240" r="188" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 10"/>
  <circle cx="240" cy="196" r="74" fill="url(#body)"/>
  <path d="M240 288 c -76 0 -122 44 -134 106 a 190 190 0 0 0 268 0 c -12 -62 -58 -106 -134 -106 z" fill="url(#body)"/>
  <path d="M52 60 l10 22 22 10 -22 10 -10 22 -10 -22 -22 -10 22 -10 z" fill="#ffffff" opacity="0.9"/>
  <path d="M420 340 l7 15 15 7 -15 7 -7 15 -7 -15 -15 -7 15 -7 z" fill="#ffffff" opacity="0.7"/>
</svg>`);
console.log("✓ public/images/avatar.svg");

/* ======================= 7. 微信二维码占位 wechat-qr.svg ======================= */
{
  const N = 25, S = 8, Q = 16, W = N * S + Q * 2;
  let cells = "";
  const finder = (fx, fy) => {
    cells += `<rect x="${Q + fx * S}" y="${Q + fy * S}" width="${7 * S}" height="${7 * S}" fill="#111"/>`;
    cells += `<rect x="${Q + (fx + 1) * S}" y="${Q + (fy + 1) * S}" width="${5 * S}" height="${5 * S}" fill="#fff"/>`;
    cells += `<rect x="${Q + (fx + 2) * S}" y="${Q + (fy + 2) * S}" width="${3 * S}" height="${3 * S}" fill="#111"/>`;
  };
  const inFinder = (i, j) =>
    (i < 8 && j < 8) || (i < 8 && j >= N - 8) || (i >= N - 8 && j < 8);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (inFinder(i, j)) continue;
      if ((i * 31 + j * 17 + ((i * j) % 11) * 7) % 13 < 5) {
        cells += `<rect x="${Q + i * S}" y="${Q + j * S}" width="${S}" height="${S}" fill="#111"/>`;
      }
    }
  }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W + 46}">
  <rect width="${W}" height="${W}" rx="12" fill="#fff"/>
  ${cells}
  <rect x="${W / 2 - 26}" y="${W / 2 - 26}" width="52" height="52" rx="10" fill="#fff"/>
  <circle cx="${W / 2}" cy="${W / 2}" r="17" fill="#22c55e"/>
  <text x="${W / 2}" y="${W / 2 + 6}" font-size="18" text-anchor="middle" fill="#fff" font-family="sans-serif">微</text>
  <text x="${W / 2}" y="${W + 32}" font-size="20" text-anchor="middle" fill="#94a3b8" font-family="sans-serif">示例二维码 · 请在 public/images/wechat-qr.svg 替换</text>
</svg>`;
  writeFileSync(join(IMG, "wechat-qr.svg"), svg);
  console.log("✓ public/images/wechat-qr.svg");
}

console.log("\n全部占位资源生成完毕！");

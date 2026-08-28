# ✨ 个人作品集 & 自我介绍网站

一个为应届毕业生打造的**深色系玻璃拟态（Glassmorphism）**风格个人网站：展示项目作品、个人经历、技能与简历，支持文件上传托管（Supabase）、在线预览、主题切换与丰富滚动动效。

> 默认为暗色星空主题，支持一键切换浅色；全部占位内容以 `[方括号]` 标注，全局搜索替换即可完成「换皮」。

![技术栈](https://img.shields.io/badge/Next.js%2015-App%20Router-black) ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8) ![Motion](https://img.shields.io/badge/Framer%20Motion%20%2B%20GSAP-动画-ec4899)

---

## 🚀 快速开始

```bash
# 环境要求：Node.js >= 18.18（推荐 20+）
npm install        # 安装依赖
npm run dev        # 开发模式 → http://localhost:3000
npm run build      # 生产构建
npm run start      # 运行生产构建
```

> 未配置 Supabase 时网站**开箱即用**：文件板块自动降级为演示模式，其余功能全部正常。

---

## 📁 目录结构

```
个人介绍网站设计/
├── public/
│   ├── images/                 # 占位图片（封面 / 截图 / 头像 / 微信二维码）→ 替换成你的素材
│   ├── files/                  # 示例 PDF（简历 / 项目报告占位）→ 替换成你的真实文件
│   └── og.png                  # Open Graph 分享图（1200×630）
├── scripts/
│   └── generate-assets.mjs     # 占位资源生成脚本：npm run generate:assets 可随时重新生成
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局：SEO / Open Graph / 主题初始化 / 全局组件
│   │   ├── page.tsx            # 主页（按顺序组装各板块）
│   │   ├── globals.css         # 设计系统：颜色令牌 / 玻璃拟态 / 动效关键帧
│   │   ├── icon.png            # 网站图标（favicon）
│   │   ├── not-found.tsx       # 404 页面
│   │   └── projects/[slug]/    # 作品详情子页面（SSG 静态生成）
│   ├── components/
│   │   ├── layout/             # Navbar（导航）、Footer（页脚）
│   │   ├── sections/           # 九大板块组件
│   │   │   ├── Hero.tsx        # 首屏：打字机 + 逐字入场 + 3D 陀螺仪
│   │   │   ├── About.tsx       # 关于我：照片 + 数字滚动 + 兴趣标签
│   │   │   ├── Portfolio.tsx   # 作品集：筛选 + 3D 倾斜卡片 + 详情弹窗
│   │   │   ├── Experience.tsx  # 经历：GSAP 时间线生长动画
│   │   │   ├── Skills.tsx      # 技能：进度条 + 软技能 + 语言/工具
│   │   │   ├── FilesSection.tsx# 文件&简历：上传/预览/下载/密码保护
│   │   │   └── Contact.tsx     # 联系：表单成功动画 + 微信二维码弹窗
│   │   ├── files/              # 文件卡片、预览弹窗
│   │   ├── projects/           # 详情页截图画廊（灯箱）
│   │   └── ui/                 # 通用组件：背景粒子 / 加载屏 / 自定义光标 / 主题切换等
│   ├── data/                   # ⭐ 全部内容数据（改内容只动这里）
│   │   ├── site.ts             # 名字 / 导航 / 社交链接 / 简历地址 / SEO
│   │   ├── profile.ts          # 个人简介 / 统计数据 / 兴趣
│   │   ├── projects.ts         # 项目列表（卡片+弹窗+详情页共用）
│   │   ├── experience.ts       # 时间线经历
│   │   ├── skills.ts           # 技能 / 语言 / 工具
│   │   └── files.ts            # 文件板块配置 + 演示文件
│   ├── hooks/                  # useActiveSection（导航高亮）、useTypewriter（打字机）
│   └── lib/                    # supabase.ts（上传/客户端）、utils.ts、gsap.ts
├── .env.example                # 环境变量模板
└── package.json
```

---

## ✏️ 内容修改指南（上线前必读）

### 1. 替换占位文字

全部文字内容集中在 **`src/data/`** 目录，无需碰组件代码：

| 文件 | 要改的内容 |
|------|-----------|
| `site.ts` | 你的名字、邮箱、GitHub / LinkedIn 链接、SEO 描述、上线域名 |
| `profile.ts` | 打字机身份词、一句话介绍、自我介绍段落、统计数字、兴趣爱好 |
| `projects.ts` | 项目卡片 / 详情（每个项目一个对象，增删即可） |
| `experience.ts` | 时间线经历（教育 / 实习 / 获奖） |
| `skills.ts` | 技能进度条百分比、软技能、语言、工具 |

推荐直接**全局搜索 `[`**，把 `[你的名字]`、`[你的专业]`、`[你的大学]`、`[某互联网公司]` 等占位符一次替换完毕。

### 2. 替换图片素材

| 位置 | 用途 | 建议规格 |
|------|------|----------|
| `public/images/avatar.svg` | 头像（关于我） | 正方形，≥ 480×480 |
| `public/images/cover-1..6.svg` | 项目封面 | 8:5 比例，≥ 800×500 |
| `public/images/shot-*.svg` | 项目截图（弹窗/详情页） | 8:5 比例 |
| `public/images/wechat-qr.svg` | 微信二维码 | 正方形图片即可 |
| `public/og.png` | 社交分享图 | 1200×630 |

图片也可以直接使用外链（Supabase / 图床），把 `projects.ts` 里的路径改成 `https://...` 即可。

### 3. 替换简历

把你的真实简历 PDF 覆盖 `public/files/resume.pdf`，或上传到 Supabase 后修改 `src/data/site.ts` 中的 `resumeUrl`（导航栏、Hero、文件板块的下载按钮共用这一个地址）。

### 4. 调整配色 / 动效

设计令牌集中在 `src/app/globals.css`：

- 主渐变：搜索 `#6366f1 / #a855f7 / #ec4899`（靛蓝 → 紫 → 粉），统一替换即可换品牌色
- 背景色：`:root` 中的 `--bg`（暗色）与 `.light` 中的 `--bg`（浅色）
- 动效节奏：各组件内的 `transition / duration` 值

### 5. 新增 / 修改项目

编辑 `src/data/projects.ts`，复制一个现有项目对象修改即可。`category` 决定筛选归类（前端 / 后端 / 设计 / 其他），`slug` 决定详情页地址（`/projects/你的slug`）。详情页为 SSG 静态生成，构建时自动产出。

---

## 🗄️ Supabase 配置指南（启用文件上传）

1. 访问 [supabase.com](https://supabase.com) 注册并 **New Project**（免费额度足够个人网站使用）
2. 进入 **Storage** → **New bucket**：
   - 名称：`portfolio-files`（与 `src/data/files.ts` 中 `bucket` 一致）
   - **勾选 Public bucket**（公开读取，方便在线预览与下载）
3. 配置访问策略：bucket 页面 → **Policies** → 新建策略，或直接在 SQL Editor 执行：

```sql
-- 允许所有人读取（预览/下载）
create policy "Public read portfolio-files"
on storage.objects for select
using (bucket_id = 'portfolio-files');

-- 允许匿名上传（配合网站内的前端密码保护）
create policy "Anon upload portfolio-files"
on storage.objects for insert
with check (bucket_id = 'portfolio-files');
```

4. 获取密钥：**Project Settings → API**，复制 `Project URL` 与 `anon public` key
5. 在项目根目录创建 `.env.local`（参考 `.env.example`）：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_UPLOAD_PASSWORD=改成你自己的密码
```

6. 重启 `npm run dev`，文件板块的警告横幅消失，输入密码解锁后即可拖拽上传

> ⚠️ 安全说明：按需求，上传保护为**前端层面密码**（`NEXT_PUBLIC_UPLOAD_PASSWORD` 会打包进浏览器可见代码，仅防君子）。
> 如需更强安全，建议后续加一个 Route Handler 用 service_role key 签名上传，或改用 Supabase Edge Function。

---

## 📬 联系表单（可选）

表单默认为**演示模式**（提交后播放成功动画）。要真实收信：

1. 到 [formspree.io](https://formspree.io) 免费创建表单，获得形如 `https://formspree.io/f/xxxx` 的端点
2. 写入 `.env.local`：`NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxx`

## 🎵 背景音乐（可选）

在 `src/data/site.ts` 中给 `music.url` 填入 mp3 地址（本地放 `public/audio/bgm.mp3` 或外链），导航栏会自动出现音乐开关；留空则隐藏。

## 📊 访问统计（可选）

推荐 [Umami](https://umami.is)（开源）或 [Plausible](https://plausible.io)。
以 Umami 为例，在 `src/app/layout.tsx` 的 `<head>` 中加入：

```tsx
<script defer src="https://你的umami地址/script.js" data-website-id="你的网站ID" />
```

---

## 🌐 部署指南（Vercel）

1. **推送代码到 GitHub**

```bash
git init && git add -A && git commit -m "feat: my portfolio"
git remote add origin https://github.com/你的用户名/portfolio.git
git push -u origin main
```

2. **导入 Vercel**：访问 [vercel.com/new](https://vercel.com/new) → 选择该仓库 → Import
3. **配置环境变量**：在 Vercel 项目的 *Settings → Environment Variables* 中添加 `.env.local` 里的全部变量（Supabase URL / Key / 上传密码 / 表单端点）
4. **Deploy**：框架会自动识别 Next.js，直接部署，约 1 分钟完成
5. **绑定域名（推荐）**：*Settings → Domains* 添加你的域名（如 `yourname.dev`），按提示在域名服务商加一条 CNAME 记录；同时把 `src/data/site.ts` 中的 `url` 更新为新域名并重新部署（SEO / Open Graph 用）

之后每次 `git push`，Vercel 会自动构建发布。

---

## ✅ 功能清单

- [x] 品牌加载屏（会话内只播一次）+ 自定义光标（桌面端）
- [x] 粒子星空 + 渐变光晕背景（Canvas，标签页隐藏自动暂停，性能友好）
- [x] 导航栏滚动毛玻璃 + 当前板块高亮 + 移动端全屏菜单
- [x] Hero：打字机 / 逐字入场 / GSAP 视差 / 3D 陀螺仪装饰
- [x] 关于我：数字滚动统计 / 渐变边框头像 / 悬浮徽章
- [x] 作品集：分类筛选布局动画 / 3D 倾斜 + 鼠标光影卡片 / 详情弹窗（截图轮播）/ 独立详情页
- [x] 经历：GSAP ScrollTrigger 时间线生长 + 左右交替节点
- [x] 技能：进度条填充 + 流光 / 软技能 / 语言 / 工具
- [x] 文件&简历：Supabase 上传（真实进度条）/ 在线预览（图片、PDF）/ 下载 / 密码保护 / 未配置时演示模式
- [x] 联系：表单校验 + 成功动画（支持 Formspree）/ 微信二维码弹窗
- [x] 深色/浅色主题切换（默认深色，持久化，无闪烁）
- [x] 火箭回到顶部按钮、SEO + Open Graph + JSON-LD、404 页面
- [x] 全站响应式 + `prefers-reduced-motion` 动效降级

## ❓ 常见问题

- **上传按钮点了没反应？** 未配置 Supabase 时会弹出提示横幅，属正常降级；按上文配置即可。
- **修改了 data 文件没生效？** 开发模式热更新一般即时生效；生产模式需重新 `npm run build && npm run start`。
- **图片换成外链后不显示？** 确认链接可公开访问（Supabase bucket 需 Public）。
- **想加博客板块？** 在 `src/app` 下新增 `blog/` 路由 + 数据文件即可，结构可参考 `projects/[slug]`。

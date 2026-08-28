/**
 * 结构化数据（JSON-LD）：让搜索引擎理解这是「个人主页」
 * 👉 数据来源于 src/data/site.ts
 */
import { site } from "@/data/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: site.socials.email,
    sameAs: [site.socials.github, site.socials.linkedin],
    jobTitle: "全栈开发者",
    description: site.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 主页：单页应用（SPA），按顺序组装各板块
 * 各板块通过锚点 id 与导航栏联动（平滑滚动）
 */
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import FilesSection from "@/components/sections/FilesSection";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Portfolio />
      <Experience />
      <Skills />
      <FilesSection />
      <Contact />
    </main>
  );
}

import Link from "next/link";

/** 404 页面 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-gradient text-7xl font-bold md:text-9xl">404</p>
      <h1 className="mt-4 text-xl font-bold md:text-2xl">页面走丢了 🛸</h1>
      <p className="mt-2 text-sm text-muted">你要找的内容可能已被移动或删除。</p>
      <Link href="/" className="btn-gradient mt-8 px-7 py-3 text-sm">
        回到首页
      </Link>
    </main>
  );
}

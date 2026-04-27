import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campaign Studio",
  description: "AI 产品宣传物料工作台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand-title">Campaign Studio</div>
            <div className="brand-subtitle">AI 产品宣传物料工作台</div>
            <nav className="nav">
              <Link href="/">工作台</Link>
              <Link href="/campaigns/new">新建宣传任务</Link>
              <Link href="/settings/image-api">生图 API 配置</Link>
              <Link href="/brand">品牌配置</Link>
            </nav>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}

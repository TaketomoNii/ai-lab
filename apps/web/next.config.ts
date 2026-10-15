import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
/** 開発時に PPTist エディタ（Vite）が動いている URL */
const editorDevUrl = process.env.EDITOR_DEV_URL ?? "http://localhost:5173";

const nextConfig: NextConfig = {
  async rewrites() {
    // 本番: apps/editor のビルド結果（public/editor）を配信する
    // 開発: Vite の開発サーバーへ転送する
    return isDev
      ? [
          { source: "/editor", destination: `${editorDevUrl}/editor/` },
          { source: "/editor/:path*", destination: `${editorDevUrl}/editor/:path*` },
        ]
      : [{ source: "/editor", destination: "/editor/index.html" }];
  },
};

export default nextConfig;

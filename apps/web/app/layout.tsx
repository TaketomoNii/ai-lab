import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Nav from "./components/Nav";

export const metadata: Metadata = { title: "Slidea", description: "講義・プレゼン資料のナレッジシステム" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}

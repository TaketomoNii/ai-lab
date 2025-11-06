import type { Metadata } from "next";
import Providers from "./providers";
import Nav from "./components/Nav";

export const metadata: Metadata = { title: "ASJ AI Lab", description: "AI-driven dev sandbox" };

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

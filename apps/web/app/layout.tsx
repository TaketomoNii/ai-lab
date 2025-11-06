import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import Providers from './providers';
import Nav from './components/Nav';

export const metadata: Metadata = {
  title: {
    default: 'AI Web Service',
    template: '%s | AI Web Service',
  },
  description: 'AI-driven dev sandbox',
};

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

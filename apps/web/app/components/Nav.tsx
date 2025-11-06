'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const { data: s } = useSession();
  const pathname = usePathname();

  return (
    <nav className="h-14 flex items-center gap-4 px-4 border-b bg-white/80 backdrop-blur">
      <Link href="/">Home</Link>
      <Link href="/protected">Protected</Link>
      {!pathname?.startsWith('/login') && (
        <span className="ml-auto text-sm text-slate-600">{s?.user?.email ?? 'Sign in'}</span>
      )}
    </nav>
  );
}

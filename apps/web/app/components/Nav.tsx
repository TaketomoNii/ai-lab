'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const { data: s } = useSession();
  const pathname = usePathname();

  return (
    <nav className="h-14 flex items-center gap-4 px-4 border-b bg-white/80 backdrop-blur">
      <Link href="/">Home</Link>
      <Link href="/protected">Protected</Link>
      <span className="ml-auto" />
      {s?.user ? (
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
        >
          Sign out
        </button>
      ) : (
        !pathname?.startsWith('/login') && (
          <Link
            href="/login"
            className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            Sign in
          </Link>
        )
      )}
    </nav>
  );
}

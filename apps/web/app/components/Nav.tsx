'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Nav() {
  const { data: s } = useSession();
  return (
    <nav className="flex gap-4 p-3 border-b">
      <Link href="/">Home</Link>
      <Link href="/protected">Protected</Link>
      <span className="ml-auto" />
      {s ? (
        <button className="border rounded px-2 py-1" onClick={() => signOut()}>
          Sign out
        </button>
      ) : (
        <Link href="/login">Sign in</Link>
      )}
    </nav>
  );
}

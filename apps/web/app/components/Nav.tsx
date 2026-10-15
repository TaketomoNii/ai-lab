"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3 text-sm">
        <Link href="/" className="text-base font-bold">Slidea</Link>
        {session && <Link href="/decks" className="hover:underline">資料一覧</Link>}
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <span className="text-gray-500">{session.user?.name ?? session.user?.email}</span>
              <button className="rounded border px-2 py-1 hover:bg-gray-50" onClick={() => signOut({ callbackUrl: "/" })}>
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded border px-2 py-1 hover:bg-gray-50">ログイン</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

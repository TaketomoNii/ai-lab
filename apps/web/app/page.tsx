"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">ASJ AI Lab</h1>
      {session ? (
        <div className="space-y-2">
          <p>Signed in as {session.user?.email}</p>
          <button className="border rounded px-3 py-2" onClick={() => signOut()}>Sign out</button>
          <div><Link className="underline" href="/protected">Go to protected page</Link></div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>You are not signed in.</p>
          <Link className="underline" href="/login">Sign in</Link>
        </div>
      )}
    </main>
  );
}

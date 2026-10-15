import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-10">
      <h1 className="text-3xl font-bold">Slidea</h1>
      <p className="text-gray-600">講義・プレゼン資料を作り、蓄積し、再利用するためのナレッジシステム。</p>
      {session ? (
        <Link className="inline-block rounded bg-black px-4 py-2 text-white" href="/decks">資料一覧へ</Link>
      ) : (
        <Link className="inline-block rounded bg-black px-4 py-2 text-white" href="/login">ログイン</Link>
      )}
    </main>
  );
}

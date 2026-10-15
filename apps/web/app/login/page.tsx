import { devLoginEnabled } from "@/lib/auth";
import LoginButtons from "./LoginButtons";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; callbackUrl?: string }> }) {
  const { error, callbackUrl } = await searchParams;
  // 外部サイトへのリダイレクトを防ぐため、相対パスのみ受け付ける
  const safeCallback = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/decks";
  return (
    <main className="grid min-h-[70vh] place-items-center px-4">
      <div className="w-full max-w-sm space-y-4 rounded-xl border p-8 shadow">
        <h1 className="text-xl font-semibold">ログイン</h1>
        {error && <div className="text-sm text-red-600">ログインできませんでした（{error}）</div>}
        <LoginButtons callbackUrl={safeCallback} devLogin={devLoginEnabled} />
      </div>
    </main>
  );
}

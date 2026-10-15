"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DeckSummary } from "@/lib/deck/types";

const editorUrl = (id: string) => `/editor?deck=${encodeURIComponent(id)}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" });

export default function DeckList({ decks }: { decks: DeckSummary[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      setBusy(false);
      setError("作成に失敗しました");
      return;
    }
    const { deck } = (await res.json()) as { deck: DeckSummary };
    window.location.href = editorUrl(deck.id);
  }

  async function remove(deck: DeckSummary) {
    if (!confirm(`「${deck.title}」を削除しますか？この操作は取り消せません。`)) return;
    const res = await fetch(`/api/decks/${deck.id}`, { method: "DELETE" });
    if (!res.ok) setError("削除に失敗しました");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="新しい資料のタイトル"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" disabled={busy}>
          新規作成
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {decks.length === 0 ? (
        <p className="text-gray-500">まだ資料がありません。上のフォームから作成してください。</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {decks.map((deck) => (
            <li key={deck.id} className="flex flex-col rounded-lg border p-4">
              <a href={editorUrl(deck.id)} className="text-lg font-semibold hover:underline">{deck.title}</a>
              <p className="mt-1 text-xs text-gray-500">
                {deck.slideCount} 枚 ・ 更新 {formatDate(deck.updatedAt)}
              </p>
              {deck.slideTitles.some(Boolean) && (
                <ol className="mt-2 list-inside list-decimal text-sm text-gray-600">
                  {deck.slideTitles.slice(0, 4).map((t, i) => (
                    <li key={i} className="truncate">{t || "（タイトルなし）"}</li>
                  ))}
                  {deck.slideCount > 4 && <li className="list-none text-gray-400">…</li>}
                </ol>
              )}
              <div className="mt-auto flex gap-2 pt-3 text-sm">
                <a href={editorUrl(deck.id)} className="rounded border px-3 py-1 hover:bg-gray-50">開く</a>
                <button onClick={() => remove(deck)} className="rounded border px-3 py-1 text-red-600 hover:bg-red-50">
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

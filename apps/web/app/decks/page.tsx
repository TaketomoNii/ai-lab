import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDeckRepository } from "@/lib/deck/repository";
import DeckList from "./DeckList";

export const dynamic = "force-dynamic";

export default async function DecksPage() {
  if (!(await getSession())) redirect("/login?callbackUrl=/decks");
  const decks = await getDeckRepository().list();
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">資料一覧</h1>
      <DeckList decks={decks} />
    </main>
  );
}

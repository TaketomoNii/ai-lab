import { NextResponse } from "next/server";
import { jsonError, readJson, withAuth } from "@/lib/api";
import { getDeckRepository } from "@/lib/deck/repository";
import { summarize } from "@/lib/deck/types";

export const GET = withAuth(async () => {
  return NextResponse.json({ decks: await getDeckRepository().list() });
});

export const POST = withAuth(async (req) => {
  const body = (await readJson(req)) as { title?: unknown; description?: unknown; tags?: unknown } | undefined;
  const title = typeof body?.title === "string" ? body.title : "";
  if (title.length > 200) return jsonError(400, "title must be <= 200 chars");
  const description = typeof body?.description === "string" ? body.description : "";
  const tags = Array.isArray(body?.tags) ? body.tags.filter((t): t is string => typeof t === "string") : [];
  const deck = await getDeckRepository().create({ title, description, tags });
  return NextResponse.json({ deck: summarize(deck) }, { status: 201 });
});

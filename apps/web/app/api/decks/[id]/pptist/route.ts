import { NextResponse } from "next/server";
import { jsonError, readJson, withAuth } from "@/lib/api";
import { applyPptistDocument, parsePptistDocument, toPptistDocument } from "@/lib/deck/pptist";
import { getDeckRepository } from "@/lib/deck/repository";

type Ctx = { params: Promise<{ id: string }> };

/** エディタ（PPTist）用の形式で資料を返す */
export const GET = withAuth(async (_req, { params }: Ctx) => {
  const { id } = await params;
  return NextResponse.json(toPptistDocument(await getDeckRepository().get(id)));
});

/** エディタからの保存。revision が古い場合は 409 */
export const PUT = withAuth(async (req, { params }: Ctx) => {
  const { id } = await params;
  const parsed = parsePptistDocument(await readJson(req));
  if (!parsed.ok) return jsonError(400, parsed.error);
  const { revision, ...doc } = parsed.doc;
  const deck = await getDeckRepository().update(id, revision, (d) => applyPptistDocument(d, doc));
  return NextResponse.json({ revision: deck.revision, updatedAt: deck.updatedAt });
});

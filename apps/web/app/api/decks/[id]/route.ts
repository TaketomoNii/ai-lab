import { NextResponse } from "next/server";
import { jsonError, readJson, withAuth } from "@/lib/api";
import { getDeckRepository } from "@/lib/deck/repository";

type Ctx = { params: Promise<{ id: string }> };

/** 資料を Slidea 形式で返す（ナレッジ機能・AI 連携向け） */
export const GET = withAuth(async (_req, { params }: Ctx) => {
  const { id } = await params;
  return NextResponse.json({ deck: await getDeckRepository().get(id) });
});

/** タイトル・説明・タグを更新する */
export const PATCH = withAuth(async (req, { params }: Ctx) => {
  const { id } = await params;
  const body = (await readJson(req)) as Record<string, unknown> | undefined;
  if (typeof body?.revision !== "number") return jsonError(400, "revision is required");
  const { title, description, tags } = body;
  if (title !== undefined && (typeof title !== "string" || !title.trim() || title.length > 200)) {
    return jsonError(400, "title must be a non-empty string (<= 200 chars)");
  }
  if (description !== undefined && typeof description !== "string") return jsonError(400, "description must be a string");
  if (tags !== undefined && (!Array.isArray(tags) || tags.some((t) => typeof t !== "string"))) {
    return jsonError(400, "tags must be an array of strings");
  }
  const deck = await getDeckRepository().update(id, body.revision, (d) => ({
    ...d,
    ...(title !== undefined && { title: (title as string).trim() }),
    ...(description !== undefined && { description: description as string }),
    ...(tags !== undefined && { tags: tags as string[] }),
  }));
  return NextResponse.json({ deck });
});

export const DELETE = withAuth(async (_req, { params }: Ctx) => {
  const { id } = await params;
  await getDeckRepository().delete(id);
  return new Response(null, { status: 204 });
});

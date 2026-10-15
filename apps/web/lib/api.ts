import { NextResponse } from "next/server";
import { getSession } from "./auth";
import { DeckConflictError, DeckNotFoundError } from "./deck/repository";

export const jsonError = (status: number, error: string, extra?: Record<string, unknown>) =>
  NextResponse.json({ error, ...extra }, { status });

/** ログイン済みでなければ 401 を返すハンドラにする */
export function withAuth<A extends unknown[]>(handler: (req: Request, ...args: A) => Promise<Response>) {
  return async (req: Request, ...args: A) => {
    if (!(await getSession())) return jsonError(401, "unauthorized");
    try {
      return await handler(req, ...args);
    } catch (e) {
      if (e instanceof DeckNotFoundError) return jsonError(404, "deck not found");
      if (e instanceof DeckConflictError) {
        return jsonError(409, "deck was updated elsewhere", { currentRevision: e.currentRevision });
      }
      throw e;
    }
  };
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DeckConflictError, DeckNotFoundError, FileDeckRepository } from "./repository";

let dir: string;
let repo: FileDeckRepository;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "slidea-test-"));
  repo = new FileDeckRepository(dir);
});
afterEach(() => rm(dir, { recursive: true, force: true }));

describe("FileDeckRepository", () => {
  it("作成・取得・一覧", async () => {
    const deck = await repo.create({ title: "第1回 講義" });
    expect(deck.revision).toBe(1);
    expect(deck.slides).toHaveLength(1);
    expect((await repo.get(deck.id)).title).toBe("第1回 講義");
    expect((await repo.list()).map((d) => d.id)).toEqual([deck.id]);
  });

  it("空のディレクトリでは空の一覧を返す", async () => {
    expect(await new FileDeckRepository(path.join(dir, "none")).list()).toEqual([]);
  });

  it("更新すると revision が増え、古い revision での更新は競合になる", async () => {
    const deck = await repo.create({ title: "a" });
    const updated = await repo.update(deck.id, 1, (d) => ({ ...d, title: "b" }));
    expect(updated.revision).toBe(2);
    await expect(repo.update(deck.id, 1, (d) => d)).rejects.toBeInstanceOf(DeckConflictError);
  });

  it("同時の更新は1つだけ成功する", async () => {
    const deck = await repo.create({ title: "a" });
    const results = await Promise.allSettled([
      repo.update(deck.id, 1, (d) => ({ ...d, title: "x" })),
      repo.update(deck.id, 1, (d) => ({ ...d, title: "y" })),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  });

  it("削除後は見つからない。不正な ID も見つからない扱い", async () => {
    const deck = await repo.create({ title: "a" });
    await repo.delete(deck.id);
    await expect(repo.get(deck.id)).rejects.toBeInstanceOf(DeckNotFoundError);
    await expect(repo.get("../etc/passwd")).rejects.toBeInstanceOf(DeckNotFoundError);
  });
});

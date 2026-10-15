/**
 * 資料の保存先。現在は JSON ファイル（DATA_DIR/decks/<id>.json）。
 * DB に移す場合は DeckRepository を実装したクラスを追加し、getDeckRepository() を差し替える。
 */
import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { DECK_SCHEMA_VERSION, summarize, type Deck, type DeckSummary } from "./types";
import { DEFAULT_CANVAS, blankSlide, extractSlide } from "./pptist";

export class DeckNotFoundError extends Error {}
export class DeckConflictError extends Error {
  constructor(public readonly currentRevision: number) {
    super("deck was updated elsewhere");
  }
}

export interface DeckRepository {
  list(): Promise<DeckSummary[]>;
  get(id: string): Promise<Deck>;
  create(input: { title: string; description?: string; tags?: string[] }): Promise<Deck>;
  /** expectedRevision が現在の revision と異なる場合は DeckConflictError */
  update(id: string, expectedRevision: number, change: (deck: Deck) => Deck): Promise<Deck>;
  delete(id: string): Promise<void>;
}

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
export const isValidDeckId = (id: string) => ID_PATTERN.test(id);

export class FileDeckRepository implements DeckRepository {
  /** 同一プロセス内で同じ資料への書き込みを直列化する */
  private locks = new Map<string, Promise<unknown>>();

  constructor(private readonly dir: string) {}

  private file(id: string) {
    if (!isValidDeckId(id)) throw new DeckNotFoundError(id);
    return path.join(this.dir, `${id}.json`);
  }

  private async write(deck: Deck) {
    await mkdir(this.dir, { recursive: true });
    const target = this.file(deck.id);
    const tmp = `${target}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(deck, null, 2), "utf8");
    await rename(tmp, target);
  }

  private withLock<T>(id: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(id) ?? Promise.resolve();
    const next = prev.catch(() => {}).then(fn);
    this.locks.set(id, next);
    next.finally(() => {
      if (this.locks.get(id) === next) this.locks.delete(id);
    }).catch(() => {});
    return next;
  }

  async list() {
    let files: string[];
    try {
      files = await readdir(this.dir);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw e;
    }
    const decks = await Promise.all(
      files.filter((f) => f.endsWith(".json")).map((f) => this.get(f.slice(0, -5)).catch(() => null)),
    );
    return decks
      .filter((d): d is Deck => d !== null)
      .map(summarize)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string) {
    try {
      return JSON.parse(await readFile(this.file(id), "utf8")) as Deck;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") throw new DeckNotFoundError(id);
      throw e;
    }
  }

  async create(input: { title: string; description?: string; tags?: string[] }) {
    const now = new Date().toISOString();
    const slide = blankSlide();
    const deck: Deck = {
      schemaVersion: DECK_SCHEMA_VERSION,
      id: randomUUID(),
      title: input.title.trim() || "無題の資料",
      description: input.description ?? "",
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
      revision: 1,
      canvas: { ...DEFAULT_CANVAS },
      theme: null,
      slides: [{ ...extractSlide(slide), render: { engine: "pptist", data: slide } }],
    };
    await this.write(deck);
    return deck;
  }

  update(id: string, expectedRevision: number, change: (deck: Deck) => Deck) {
    return this.withLock(id, async () => {
      const current = await this.get(id);
      if (current.revision !== expectedRevision) throw new DeckConflictError(current.revision);
      const next: Deck = {
        ...change(current),
        id: current.id,
        schemaVersion: DECK_SCHEMA_VERSION,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        revision: current.revision + 1,
      };
      await this.write(next);
      return next;
    });
  }

  delete(id: string) {
    return this.withLock(id, async () => {
      await this.get(id);
      await rm(this.file(id));
    });
  }
}

let repo: DeckRepository | undefined;

export function getDeckRepository(): DeckRepository {
  if (!repo) {
    const dataDir = process.env.SLIDEA_DATA_DIR ?? path.join(process.cwd(), "data");
    repo = new FileDeckRepository(path.join(dataDir, "decks"));
  }
  return repo;
}

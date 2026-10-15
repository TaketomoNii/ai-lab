/**
 * PPTist（apps/editor）のデータと Slidea の資料形式の相互変換。
 * PPTist の型定義: apps/editor/src/types/slides.ts
 */
import { randomUUID } from "node:crypto";
import { htmlToText } from "./text";
import type { Deck, DeckSlide } from "./types";

export const DEFAULT_CANVAS = { width: 1000, aspectRatio: 0.5625 };

type Obj = Record<string, unknown>;

export interface PptistSlide extends Obj {
  id: string;
  elements: Obj[];
  remark?: string;
}

/** エディタとやり取りするドキュメント */
export interface PptistDocument {
  revision: number;
  title: string;
  theme?: Obj;
  slides: PptistSlide[];
  viewportSize: number;
  viewportRatio: number;
}

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v : "");

function elementText(el: Obj): string {
  switch (el.type) {
    case "text":
      return htmlToText(str(el.content));
    case "shape":
      return isObj(el.text) ? htmlToText(str(el.text.content)) : "";
    case "table": {
      const rows = Array.isArray(el.data) ? el.data : [];
      return rows
        .map((row) => (Array.isArray(row) ? row.map((c) => (isObj(c) ? str(c.text) : "")).join("\t") : ""))
        .join("\n")
        .trim();
    }
    case "latex":
      return str(el.latex);
    default:
      return "";
  }
}

export function extractSlide(slide: PptistSlide): Omit<DeckSlide, "render"> {
  const elements = slide.elements.filter(isObj);
  const texts = elements.map(elementText).filter(Boolean);
  const titleEl = elements.find((el) => el.type === "text" && el.textType === "title");
  const title = (titleEl ? elementText(titleEl) : texts[0] ?? "").split("\n")[0].trim();
  return {
    id: slide.id,
    title,
    text: texts.join("\n"),
    notes: htmlToText(str(slide.remark)),
  };
}

export function blankSlide(): PptistSlide {
  return {
    id: randomUUID().slice(0, 10),
    elements: [],
    background: { type: "solid", color: "#ffffff" },
  };
}

export function toPptistDocument(deck: Deck): PptistDocument {
  return {
    revision: deck.revision,
    title: deck.title,
    theme: deck.theme?.engine === "pptist" && isObj(deck.theme.data) ? deck.theme.data : undefined,
    slides: deck.slides.map((s) => {
      if (s.render.engine !== "pptist" || !isObj(s.render.data)) {
        throw new Error(`slide ${s.id} is not a PPTist slide`);
      }
      return s.render.data as PptistSlide;
    }),
    viewportSize: deck.canvas.width,
    viewportRatio: deck.canvas.aspectRatio,
  };
}

/** エディタから受け取ったドキュメントを資料に反映した新しい資料を返す（revision は呼び出し側で更新） */
export function applyPptistDocument(deck: Deck, doc: Omit<PptistDocument, "revision">): Deck {
  return {
    ...deck,
    title: doc.title.trim() || deck.title,
    theme: doc.theme ? { engine: "pptist", data: doc.theme } : deck.theme,
    canvas: { width: doc.viewportSize, aspectRatio: doc.viewportRatio },
    slides: doc.slides.map((slide) => ({
      ...extractSlide(slide),
      render: { engine: "pptist", data: slide },
    })),
  };
}

/** リクエストボディを検証して PptistDocument にする。不正なら理由を返す */
export function parsePptistDocument(body: unknown): { ok: true; doc: PptistDocument } | { ok: false; error: string } {
  if (!isObj(body)) return { ok: false, error: "body must be an object" };
  const { revision, title, theme, slides, viewportSize, viewportRatio } = body;
  if (typeof revision !== "number" || !Number.isInteger(revision)) return { ok: false, error: "revision must be an integer" };
  if (typeof title !== "string" || title.length > 200) return { ok: false, error: "title must be a string (<= 200 chars)" };
  if (theme !== undefined && !isObj(theme)) return { ok: false, error: "theme must be an object" };
  if (!Array.isArray(slides)) return { ok: false, error: "slides must be an array" };
  for (const s of slides) {
    if (!isObj(s) || typeof s.id !== "string" || !Array.isArray(s.elements)) {
      return { ok: false, error: "each slide needs a string id and an elements array" };
    }
  }
  if (typeof viewportSize !== "number" || viewportSize <= 0) return { ok: false, error: "viewportSize must be positive" };
  if (typeof viewportRatio !== "number" || viewportRatio <= 0) return { ok: false, error: "viewportRatio must be positive" };
  return {
    ok: true,
    doc: { revision, title, theme, slides: slides as PptistSlide[], viewportSize, viewportRatio },
  };
}

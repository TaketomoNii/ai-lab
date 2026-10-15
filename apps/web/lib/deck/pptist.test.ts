import { describe, expect, it } from "vitest";
import { applyPptistDocument, extractSlide, parsePptistDocument, toPptistDocument } from "./pptist";
import { htmlToText } from "./text";
import { DECK_SCHEMA_VERSION, type Deck } from "./types";

const baseDeck: Deck = {
  schemaVersion: DECK_SCHEMA_VERSION,
  id: "d1",
  title: "元のタイトル",
  description: "",
  tags: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  revision: 3,
  canvas: { width: 1000, aspectRatio: 0.5625 },
  theme: null,
  slides: [],
};

describe("htmlToText", () => {
  it("タグを除去し、段落と改行を保つ", () => {
    expect(htmlToText("<p>一行目</p><p>A &amp; B<br>二行目</p>")).toBe("一行目\nA & B\n二行目");
  });
});

describe("extractSlide", () => {
  it("タイトル・本文・ノートを抽出する", () => {
    const s = extractSlide({
      id: "s1",
      remark: "<p>ここで質問を受ける</p>",
      elements: [
        { type: "text", content: "<p>本文です</p>" },
        { type: "text", textType: "title", content: "<p>講義の目的</p>" },
        { type: "shape", text: { content: "<p>図形の文字</p>" } },
        { type: "table", data: [[{ text: "A" }, { text: "B" }]] },
        { type: "image", src: "x.png" },
      ],
    });
    expect(s.title).toBe("講義の目的");
    expect(s.text).toBe("本文です\n講義の目的\n図形の文字\nA\tB");
    expect(s.notes).toBe("ここで質問を受ける");
  });

  it("タイトル要素がなければ最初のテキストの1行目を使う", () => {
    expect(extractSlide({ id: "s", elements: [{ type: "text", content: "<p>見出し</p><p>続き</p>" }] }).title).toBe("見出し");
  });
});

describe("PPTist ドキュメントとの相互変換", () => {
  it("保存した内容をそのまま読み戻せる", () => {
    const slides = [{ id: "s1", elements: [{ type: "text", content: "<p>こんにちは</p>" }], background: { type: "solid", color: "#fff" } }];
    const deck = applyPptistDocument(baseDeck, { title: " 新タイトル ", theme: { fontColor: "#333" }, slides, viewportSize: 1000, viewportRatio: 0.75 });
    expect(deck.title).toBe("新タイトル");
    expect(deck.slides[0].title).toBe("こんにちは");
    expect(deck.canvas).toEqual({ width: 1000, aspectRatio: 0.75 });

    const doc = toPptistDocument(deck);
    expect(doc.slides).toEqual(slides);
    expect(doc.theme).toEqual({ fontColor: "#333" });
    expect(doc.revision).toBe(3);
  });

  it("空のタイトルでは元のタイトルを保つ", () => {
    expect(applyPptistDocument(baseDeck, { title: "  ", slides: [], viewportSize: 1000, viewportRatio: 0.5625 }).title).toBe("元のタイトル");
  });
});

describe("parsePptistDocument", () => {
  const valid = { revision: 1, title: "t", slides: [{ id: "a", elements: [] }], viewportSize: 1000, viewportRatio: 0.5625 };

  it("正しい入力を受け付ける", () => {
    expect(parsePptistDocument(valid).ok).toBe(true);
  });

  it.each([
    ["revision なし", { ...valid, revision: undefined }],
    ["slides が配列でない", { ...valid, slides: {} }],
    ["slide に id がない", { ...valid, slides: [{ elements: [] }] }],
    ["viewportRatio が 0", { ...valid, viewportRatio: 0 }],
    ["本文なし", undefined],
  ])("%s は拒否する", (_label, body) => {
    expect(parsePptistDocument(body).ok).toBe(false);
  });
});

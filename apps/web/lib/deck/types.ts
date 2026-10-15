/**
 * Slidea の資料データ形式（エディタに依存しない自前の形式）。
 *
 * - 資料・スライドのメタデータと、検索・再利用・AI 連携に使うテキストはこの形式で持つ。
 * - 見た目（要素の配置など）はエディタ固有のデータとして `render` に格納する。
 *   エディタを差し替える場合は `render` の変換（アダプタ）だけを追加すればよい。
 */
export const DECK_SCHEMA_VERSION = 1;

export type RenderEngine = "pptist";

export interface SlideRender {
  engine: RenderEngine;
  data: unknown;
}

export interface DeckSlide {
  id: string;
  /** スライドのタイトル（抽出） */
  title: string;
  /** スライド内のテキスト全体（抽出・検索用） */
  text: string;
  /** 発表者ノート（プレーンテキスト） */
  notes: string;
  render: SlideRender;
}

export interface DeckCanvas {
  /** 基準幅（px） */
  width: number;
  /** 高さ / 幅（16:9 なら 0.5625） */
  aspectRatio: number;
}

export interface Deck {
  schemaVersion: typeof DECK_SCHEMA_VERSION;
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  /** 保存のたびに 1 増える。同時編集時の上書き防止に使う */
  revision: number;
  canvas: DeckCanvas;
  /** エディタ固有のテーマ設定 */
  theme: { engine: RenderEngine; data: unknown } | null;
  slides: DeckSlide[];
}

export interface DeckSummary {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  revision: number;
  slideCount: number;
  /** 各スライドのタイトル（一覧表示用） */
  slideTitles: string[];
}

export function summarize(deck: Deck): DeckSummary {
  return {
    id: deck.id,
    title: deck.title,
    description: deck.description,
    tags: deck.tags,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    revision: deck.revision,
    slideCount: deck.slides.length,
    slideTitles: deck.slides.map((s) => s.title),
  };
}

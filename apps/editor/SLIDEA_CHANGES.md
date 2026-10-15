# Slidea による PPTist の変更点

元のリポジトリ: https://github.com/pipipi-pikachu/PPTist
取り込み元のコミット: `04e06cb397b7f146c6e3e4f62ccddc0b72c041d2`（2026-10-10）
ライセンス: AGPL-3.0（`LICENSE`）

## 変更内容

- `src/slidea/`（追加）: Slidea 本体（apps/web）との連携
  - `deckSync.ts`: `?deck=<id>` の資料の読み込み、自動保存、`Ctrl/⌘ + S`、競合検知、未保存時の離脱確認
  - `SaveStatus.vue`: 保存状態の表示
- `src/App.vue`: モックデータの代わりに資料を読み込む。本番では常に表示されていた離脱確認を、未保存時のみに変更
- `src/views/Editor/EditorHeader/index.vue`: 資料一覧へ戻るボタンと保存状態を追加。PPTist 公式サーバーを使う AI 機能を非表示
- `src/views/Mobile/MobilePreview.vue`: AI 機能のボタンを非表示
- `src/services/index.ts`: PPTist 公式サーバー（server.pptist.cn）への送信をやめる
- `src/configs/font.ts`, `src/assets/styles/font.scss`: 中国語フォント（約 43MB）は取り込み時に除外し、和文はシステムフォントを選べるように変更
- `src/store/slides.ts`: 既定のタイトルを日本語に変更
- `index.html`: 言語とタイトルを変更
- `vite.config.ts`: `/editor/` 配下で配信、`/api` を apps/web へ転送、Next.js 経由のアクセス時のクエリを補正
- `package.json`, `package-lock.json`: パッケージ名、apps/web へのビルドスクリプト、husky/commitlint の削除、レジストリを npmjs.org に変更

# Cursor Setup Kit (for Next.js + TypeScript + Tailwind)

これは Cursor / VS Code で快適に開発しつつ、Codex（No API, ChatGPT サインイン）運用を安全・高速に回すための最低限キットです。

## 使い方（3分）
1. このフォルダの中身を **プロジェクトのリポジトリのルート**にコピー（既存ファイルがある場合は差分確認の上でマージ）。
2. VS Code / Cursor を再起動。**拡張の推奨**が出たらインストール。
3. `apps/web` で `npm i` → `npm run dev`。

### Codex の基本方針（承認運用）
- `.env*` と `work-local/` は **対象外**（提案・閲覧は拒否）。
- **小さく変更 → ローカルで即確認**。差分プレビューで apply。

## 含まれるもの
- `.vscode/settings.json`：保存時整形 / ESLint 自動修正 / 監視除外 / TS SDK 固定。
- `.vscode/keybindings.json`：よく使う操作（ターミナル・lint・format 等）。
- `.vscode/extensions.json`：推奨拡張（ESLint, Prettier, Tailwind, cspell）。
- `.vscode/tasks.json`：`Dev / Lint / Build` のワークスペースコマンド。
- `.vscode/launch.json`：Next.js の簡易デバッグ（apps/web）。
- `.editorconfig`：改行コードやインデントの統一。
- `.prettierrc.json`：フォーマットルール。
- `eslint.config.js`（flat）：TS/Next/Prettier 最小構成。
- `snippets/react.json`：RFC・Tailwind カード・Zustand などのスニペット。
- `.gitignore`：依存物・ビルド物・機微ファイルを除外。

## 便利コマンド
- **ターミナル切替**: Ctrl + `
- **ESLint 自動修正**: Ctrl + Alt + F
- **整形**: Ctrl + Alt + L
- **検索**: Ctrl + Shift + F
- **Quick Open**: Ctrl + P

## よくある質問
- **Codex が反応しない**: Codex パネルから ChatGPT に再サインイン。
- **本番デプロイ先が違う**: `.vercel` を削除 → `vercel link` で正しいプロジェクトに再リンク。

# Codex / Cursor Prompt Templates

## 1) 小粒UI改修（カード追加）
このワークスペースでは `.env*` と `work-local/`、`.vercel/` は対象外です。
大規模変更は小さく分割して差分提案→適用で。
まず `apps/web/app/protected/page.tsx` に Tailwind のカードUIを1つ追加し、"Hello Codex" と表示してください。
変更前後の diff を提示し、不要ファイルの変更は含めないでください。

## 2) Lint 実行と自動修正
`apps/web` を cwd として `npm run lint` を実行し、自動修正可能な範囲のみ適用する差分を提案してください。
`.env*` や `work-local/` など機微ファイルには触れないでください。

## 3) 段階的リファクタ（useSearchParams + Suspense）
Next.js 16/App Router の方針に従い、該当ページを `Suspense` でラップし、`dynamic = "force-dynamic"` を付与してください。
影響範囲を絞り、1コミット分の最小差分として提案してください。

## 4) 追加コンポーネント（apps/web/app/components）
`apps/web/app/components` に新しい UI コンポーネント（Tailwind カード）を作成し、
簡単な使用例を `protected` ページに組み込んでください（最小差分・既存スタイル順守）。

## 5) 直前変更の切り戻し
直前に適用した変更を取り消し、元の状態に戻すための最小差分を提示してください。

# Slidea

講義・プレゼン資料を作り、蓄積し、再利用するためのナレッジシステム（個人開発）。

スライドエディタには OSS の [PPTist](https://github.com/pipipi-pikachu/PPTist) を利用し、
資料の保存・検索・AI 連携などのナレッジ機能は自作部分（`apps/web`）で持つ構成です。

## 構成

```
apps/web     Next.js（自作）   ログイン、資料一覧、API、資料の保存
apps/editor  PPTist のフォーク  スライドの描画・編集（AGPL-3.0）
```

- ブラウザで開くのは `apps/web`（http://localhost:3000）だけです。`/editor` は PPTist を配信します
  （開発時は Vite 開発サーバーへ転送、本番は `apps/web/public/editor` のビルド結果）。
- エディタは `/api/decks/:id/pptist` から資料を読み込み、編集内容を自動保存します（約 1.5 秒後、`Ctrl/⌘ + S` で即時）。
- 別の場所で同じ資料が更新されていた場合（`revision` の不一致）は上書きせず、保存を停止して通知します。

### 資料データの形式

資料は `apps/web/lib/deck/types.ts` の自前の形式で保存します。

- 資料のメタデータ（タイトル・説明・タグ・更新日時・revision）
- スライドごとの **タイトル・本文テキスト・発表者ノート**（検索・再利用・AI 連携用に抽出）
- 見た目のデータは `render: { engine: "pptist", data }` としてエディタ固有の形式のまま保持

エディタを差し替える場合は、`apps/web/lib/deck/pptist.ts` に相当する変換（アダプタ）を追加します。
保存先は現在 JSON ファイル（`apps/web/data/decks/<id>.json`、`SLIDEA_DATA_DIR` で変更可）です。
DB に移す場合は `DeckRepository` を実装します。

### API

| メソッド | パス | 内容 |
|---|---|---|
| GET | `/api/decks` | 資料一覧 |
| POST | `/api/decks` | 資料の作成（`{ title }`） |
| GET | `/api/decks/:id` | 資料（Slidea 形式） |
| PATCH | `/api/decks/:id` | タイトル・説明・タグの更新（`revision` 必須） |
| DELETE | `/api/decks/:id` | 資料の削除 |
| GET / PUT | `/api/decks/:id/pptist` | エディタ用の読み込み・保存 |

すべてログインが必要です。

## セットアップ

Node.js 20 以上が必要です。

```bash
npm run setup                               # 依存関係のインストール
cp apps/web/.env.example apps/web/.env.local  # 設定を記入
npm run dev                                 # http://localhost:3000
```

`.env.local` の主な設定:

- `NEXTAUTH_SECRET`: `openssl rand -base64 32` などで生成
- `GITHUB_ID` / `GITHUB_SECRET`: GitHub OAuth App（Callback URL は `<NEXTAUTH_URL>/api/auth/callback/github`）
- `ALLOWED_GITHUB_USERS`: ログインを許可する GitHub ユーザー名（カンマ区切り）。**外部からアクセスできる場所で動かす場合は必ず設定**
- `AUTH_DEV_LOGIN=true`: 開発時のみ、GitHub なしで入れる「開発用ログイン」を表示（本番ビルドでは無効）

### 本番起動（Mac mini などで常時稼働させる場合）

```bash
npm run build
npm start          # http://localhost:3000
```

Tailscale で自分の端末からだけアクセスする場合は、`NEXTAUTH_URL` を Tailscale のアドレス
（例: `https://mac-mini.<tailnet>.ts.net`）にし、`tailscale serve` で 3000 番ポートを公開します。

## テスト

```bash
npm test             # 資料形式の変換・保存処理の単体テスト
npm run typecheck    # apps/web と apps/editor の型チェック
```

## ライセンス

`apps/editor` は PPTist（Copyright © 2020-PRESENT pipipi-pikachu）のフォークで、
**AGPL-3.0** に従います（`apps/editor/LICENSE`）。変更点は `apps/editor/SLIDEA_CHANGES.md` を参照してください。
外部にサービスとして公開する場合は、エディタ部分のソース公開など AGPL-3.0 の条件を満たす必要があります。

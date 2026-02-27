# oshime (推し活コミュニティ向けUGMアプリ)

推し活コミュニティ向けの User Generated Media (UGM) Webアプリケーションです。
旧来の Ruby on Rails + React (SPA) 構成から、最新の **TanStack Start (フルスタック TypeScript)** アーキテクチャへ全面リプレイスされました。

## 採用技術スタック

本プロジェクトは以下のモダンスタックを用いて型安全なエンドツーエンド開発を実現しています。

- **言語**: TypeScript
- **UIライブラリ**: React 19
- **フルスタックフレームワーク**: [TanStack Start](https://tanstack.com/start)
- **パッケージ管理**: `npm`
- **バンドラー**: Vite
- **スタイリング**: Tailwind CSS
- **データベース & 認証**: Supabase (PostgreSQL / Supabase Auth)
- **ORM**: Drizzle ORM
- **デプロイ**: Vercel
- **テスト**: Vitest
- **バリデーション**: Zod

## ディレクトリ構成

バックエンドとフロントエンドが統合され、一貫した型安全なコードベースとなっています。

```text
oshime/
├── app.config.ts        # Vercel 向けプリセット等の全体設定
├── vite.config.ts       # Vite & TanStack Start プラグイン設定
├── drizzle.config.ts    # Drizzle ORM 用設定ファイル
├── src/
│   ├── components/      # React UI コンポーネント (Header 等)
│   ├── routes/          # ファイルベースルーティング (ページと Loader)
│   ├── server/          # サーバー関数 (APIエンドポイントの代わり。DB操作等)
│   ├── db/              # DB接続設定および Drizzle スキーマ定義
│   └── utils/           # Zod バリデーション等のユーティリティおよびテスト
```

---

## チーム開発向け：ローカル環境構築ガイド

複数人チームでコンフリクトなく開発を進めるため、**Node.js (アプリケーション側)** はローカルで実行し、**PostgreSQL (データベース側)** は Docker Compose を利用して立ち上げる構成としています。

### ⚠️ 注意：`.env.local` の取り扱いについて
チーム開発やモダンなWeb開発において、**`.env.local` に絶対にクラウド（本番やステージング）の `DATABASE_URL` を直接書き込まないでください。**
誤って手元のコマンド（`npm run db:push` など）を実行すると、本番のユーザーデータに直接影響を与えてしまう（意図せず全消去してしまう等）大きな事故に繋がります。ローカル環境では必ず **ローカルDocker用のDBアクセスURLを指定** してください。

クラウドのURL（Supabaseの `Connection string` など）は、各開発者のPC上の `.env.local` ではなく、**Vercel のダッシュボードの環境変数設定** に入力して安全に管理します（後述）。

### 構築ステップ

1. **リポジトリのクローン**
   ```bash
   git clone <repository_url>
   cd oshime
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **ローカルDB (Docker) の起動**
   バックグラウンドで PostgreSQL コンテナを立ち上げます。
   （※Docker Desktop 等が起動していることを確認してください）
   ```bash
   docker-compose up -d
   ```

4. **環境変数の設定**
   プロジェクトルートに `.env.local` ファイルを作成し、**必ず Docker のローカルDBに向けた接続URL** を設定します。
   ```env
   # Local Development Database URL
   DATABASE_URL="postgresql://postgres:password@localhost:54322/oshime_development"
   ```

5. **データベーススキーマの反映**
   Drizzle ORM を使ってスキーマをローカルDBに同期します。
   ```bash
   npm run db:push
   ```

6. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` にアクセスできれば環境構築は成功です。

---

## ステージング環境と本番環境の運用モデル（Vercel x Supabase）

今後の開発とリリースサイクルを効率的かつ安全に回すため、以下の戦略を採用しています。

### 1. データベースの完全分離
本番データ保護のため、Supabase プロジェクトを物理的に2つに分けて運用します。
- `oshime-production` （本番環境用）
- `oshime-staging` （チームでの開発・プレビューテスト環境用）

Drizzle (`drizzle-kit`) を用いてインフラをコード管理しているため、安全に両環境へ同じスキーマを適用（`db:push`）できます。

### 2. 環境変数（クラウドURL）の安全な設定
取得したSupabaseサーバーの `Connection string` は、Vercel のダッシュボードの 「Settings > Environment Variables」 にて設定します。
- **Key**: `DATABASE_URL`
  - **環境（Environments）**: `Production` のみにチェック
  - **Value**: `oshime-production` の Connection string
- **Key**: `DATABASE_URL` （もう一つ追加）
  - **環境（Environments）**: `Preview` と `Development` にチェック
  - **Value**: `oshime-staging` の Connection string

### 3. ブランチ戦略と自動デプロイ
Vercel の機能を活用し、GitHub ブランチと自動デプロイをリンクさせます。
- **`main` ブランチ** ➔ **Production 環境** （`oshime-production` のデータを参照）
- **`develop` ブランチ** ➔ **Preview (Staging) 環境** （`oshime-staging` のデータを参照して自動デプロイ。本番直前のテスト用）
- **機能ブランチ (`feature/*`)** ➔ **Local Docker 環境** （ローカルDBを利用して手元で開発）

### 4. Supabase での RLS (Row Level Security) についてのベストプラクティス
Supabaseダッシュボードにて「RLS Disabled in Public」というセキュリティ警告が出ることがあります。
本プロジェクト（TanStack Start + Drizzle構成）では、ブラウザ（React）からデータベースを直接操作するのではなく、**必ずバックエンドのサーバー関数を経由してDrizzleでDBにアクセス**します。サーバーからのアクセスは管理者権限（postgresユーザー）で行われ、バリデーション（Zod）もサーバー側で担保しています。

したがって、複雑なDBレベルのRLSを設定する必要はありません。
**外部（フロントエンド等）からの意図しない直接アクセスや攻撃を完全に遮断する** という防御的プログラミングの観点から、ダッシュボード上の `artists` と `artist_comments` テーブルにおいて **「Enable RLS」ボタンを押してRLSを有効化するだけ（ポリシーは設定しない）** の運用としています。
これにより、サーバーからの正規のアクセスは通りつつ、外部からの直接アクセスは遮断され、警告も解消されます。

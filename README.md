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

### 前提条件
- Node.js (v20以上推奨)
- npm (v10以上)
- Docker & Docker Compose

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
   ```bash
   docker-compose up -d
   ```

4. **環境変数の設定**
   プロジェクトルートに `.env.local` ファイルを作成し、Docker の DB 接続URLを設定します。
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/oshime_development"
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
Supabase プロジェクトを以下の2つに分けて運用します。
- `oshime-production` （本番環境用）
- `oshime-staging` （チームでの開発・テスト環境用）

Drizzle (`drizzle-kit`) を用いてインフラをコード管理しているため、安全に両環境へ同じスキーマを適用（`db:push` や `db:migrate`）できます。

### 2. ブランチ戦略と自動デプロイ
Vercel の機能を活用し、GitHub ブランチとデプロイ環境をリンクさせます。
- **`main` ブランチ** ➔ **Production 環境**
  - アサインされる環境変数: `oshime-production` の DB URL
  - リリース時の本番公開用。
- **`develop` ブランチ** ➔ **Preview (Staging) 環境**
  - アサインされる環境変数: `oshime-staging` の DB URL
  - チームメンバーが Pull Request をマージする先のブランチ。Vercel により自動でプレビュー URL が発行され、ステージングDBを用いた本番同等のテストが可能です。
- **機能ブランチ (`feature/*`)**
  - 開発者は上記「構築ステップ」の通り Docker (ローカルDB) を活用し、他人に影響を与えずに手元でテストを行います。


# oshime (推し活UGM)

推し活の User Generated Media (UGM) Webアプリケーション

## 採用技術スタック

本プロジェクトは以下のモダンスタックを用いて型安全なエンドツーエンド開発を実現している。

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

バックエンドとフロントエンドが統合され、一貫した型安全なコードベースとなっている。

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

複数人チームでコンフリクトなく開発を進めるため、**Node.js (アプリケーション側)** はローカルで実行し、**PostgreSQL (データベース側)** は Docker Compose を利用して立ち上げる構成としている。

### ⚠️ 注意：`.env.local` の取り扱いについて

チーム開発において、**`.env.local` にクラウド（本番やステージング）の `DATABASE_URL` を直接書き込むことは厳禁である。**
誤って手元のコマンド（`npm run db:push` など）を実行すると、本番のユーザーデータに直接影響を与え、意図せぬデータ消失などの重大な事故に繋がる。ローカル環境では必ず **ローカルDocker用のDBアクセスURLを指定** すること。

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
バックグラウンドで PostgreSQL コンテナを立ち上げる。
（※Docker Desktop 等が起動していることを確認すること）
```bash
docker-compose up -d

```


4. **環境変数の設定**
プロジェクトルートに `.env.local` ファイルを作成し、**必ず Docker のローカルDBに向けた接続URL** を設定する。
```env
# Local Development Database URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/oshime_development"

```


5. **データベーススキーマの反映**
Drizzle ORM を使ってスキーマをローカルDBに同期する。
```bash
npm run db:push

```


6. **開発サーバーの起動**
```bash
npm run dev

```


ブラウザで `http://localhost:3000` にアクセスできれば環境構築は成功である。

---

## インフラとブランチ戦略

本番データの保護と安全なリリースサイクルを確立するため、データベース（Supabase）を物理的に2つに分離し、GitHubのブランチとVercelのデプロイ環境を完全に同期させている。

### 1. データベースの分離

* **`oshime-production`** （本番環境用DB）
* **`oshime-staging`** （チーム開発・テスト環境用DB）
※ Drizzle (`drizzle-kit`) を用いてインフラをコード管理しているため、両環境へ安全かつ再現性のあるスキーマ適用が可能である。

### 2. ブランチ戦略と開発フロー

開発は以下の3層のブランチ構造で行う。

#### 🌿 `feature/*` ブランチ (ローカル開発環境)

* **用途:** 新機能の開発やバグ修正を行う作業ブランチ。
* **DB:** 手元の Local Docker 環境 (`localhost`) を参照する。
* **フロー:** `develop` ブランチから派生させ、開発が完了したら `develop` に対して Pull Request (PR) を作成する。作業中、他のメンバーのDBには一切影響を与えない。

#### 🟡 `develop` ブランチ (ステージング環境 / Preview)

* **用途:** チーム内でのコード統合、およびリリース前の最終テストを行う合流地点。
* **DB:** `oshime-staging` を参照する。
* **フロー:** `feature/*` からの PR がマージされると、Vercel が自動でプレビューURLを発行する。このURLにアクセスすることで、本番環境に影響を与えることなく、実機（スマホ等）でのUI確認やDBロジックの結合テストが可能になる。

#### 🔴 `main` ブランチ (本番環境 / Production)

* **用途:** 実際のユーザーが利用する本番公開用ブランチ。
* **DB:** `oshime-production` を参照する。
* **フロー:** `develop` ブランチでの検証が完全に終了したコードのみをマージする（直接のコミットは禁止）。マージされると自動で本番環境にデプロイされ、ユーザーへ機能がリリースされる。

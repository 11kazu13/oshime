# oshime

## 技術スタック

TypeScriptでフルスタック開発する。

- 言語: TypeScript
- UIライブラリ: React 19
- フルスタックフレームワーク: TanStack Start
- パッケージ管理: npm
- バンドラー: Vite
- スタイリング: Tailwind CSS
- データベース / 認証: Supabase（PostgreSQL / Supabase Auth）
- ORM: Drizzle ORM
- テスト: Vitest
- バリデーション: Zod
- デプロイ: Vercel

### TanStack Start とは

TanStack Router をベースとしたフルスタックフレームワーク。

概要を掴む際は、AIに聞くか以下の動画がわかりやすい。<br>
https://youtu.be/OFVjBIjInP8?si=5hOFoKhJB2ECpioJ

---

## ディレクトリ構成

モノレポを採用する。

---

## タスク管理

やりたい内容は基本的にタスク管理表に記載する。  
https://github.com/users/11kazu13/projects/4/views/1

タスクにはメモ程度で以下を書く。

- 概要（何をするか）
- なぜやるのか（目的）
- どうやるのか（方針・実装イメージ）

メモは短くてよいが、後で見返して分かること／他の人が見ても作業内容を把握できることを意識する。

---

## 開発ガイド

コマンド操作はターミナルで行う（git / docker / npm などはすべてターミナル）。

### 初回の構築ステップ（通常は不要）

1. リポジトリをクローン（すでにある場合は不要。代わりに `git pull`）

```bash
git clone <repository_url>
cd oshime
```

2. 依存関係をインストール

```bash
npm install
```

3. ローカルDB（Docker）を起動
   ※ Docker Desktop が起動していることを確認してから実行する。

```bash
docker compose up -d
```

4. 環境変数の設定
   プロジェクトルートに `.env.local` を作成し、DockerのローカルDBに向けた接続URLを設定する。

```env
DATABASE_URL="postgresql://postgres:password@localhost:54322/oshime_development"
```

5. データベーススキーマを反映（ローカルDBに適用）

```bash
npm run db:push
```

6. 開発サーバーを起動

```bash
npm run dev
```

ターミナルに表示されたURLを開いて、ローカルサイトを確認する。

---

## インフラとブランチ戦略

本番データの保護と安全なリリースサイクルのため、DB（Supabase）を物理的に2つに分離し、GitHubブランチとVercelのデプロイ環境を同期させる。

### データベースの分離

* oshime-production（本番環境用DB）
* oshime-staging（ステージング / チーム開発・テスト用DB）

### 一時ブランチ（作業が終われば削除するブランチ）

機能追加や改修があるたびに、頻繁に追加・削除されるブランチ。<br>
マージ後に画面から新しく作成したブランチを削除する。

| ブランチ名の接頭語 | 用途       |
| --------- | -------- |
| feature/  | 機能開発    |
| hotfix/   | 緊急の不具合対応 |

### ブランチの役割

#### 一時ブランチ①：feature/*（機能開発用）

* 用途: 新機能開発 / 通常の改善 / バグ修正（緊急ではないもの）
* DB: 手元のLocal DB
* `develop` から派生し、完了したら GitHub に push → `develop` へPRを出してマージ
* マージ後、このブランチは削除する

命名例（*の部分にやりたいことを書く）:

* `feature/login`
* `feature/artist-register`

#### 一時ブランチ②：hotfix/*（緊急バグ修正用）

* 用途: 本番環境で見つかった緊急度の高い不具合対応
* DB: 原則、本番に合わせた状態で再現・修正する
* `main` から派生し、完了したら `main` へPRを出してマージ
* 重要: hotfix は `main` から切るため、開発環境（`develop`）には修正が入っていない状態になる
  → `main` マージ後に、適宜 `develop` へバックマージする
* マージ後、このブランチは削除する

命名例:

* `hotfix/決済エラー`
* `hotfix/緊急ログイン不具合`

#### develop ブランチ（ステージング / Preview）

* 用途: チーム内でのコード統合、リリース前テスト
* DB: oshime-staging
* `feature/*` がマージされると、Vercelが自動でビルド・デプロイする

#### main ブランチ（本番 / Production）

* 用途: 本番公開用
* DB: oshime-production
* `develop` で検証済みのものだけをPRでマージする（直接コミットはNG）
* `hotfix/*` は例外的に `main` に直接マージされる（緊急対応）

---

## 別々に開発する場合の進め方

通常の開発と同様に、各自が作業ブランチ（基本は feature/*）を作成して進める。

* まず[タスク管理表](https://github.com/users/11kazu13/projects/4/views/1)に「やりたい内容」を書く
* 例: ログイン機能を実装したい場合

  * タスク: ログイン機能の実装
  * ブランチ: `feature/login`（または `feature/ログイン機能`）

---

## 開発開始時のルーティン（毎回）

まず `develop` を最新化する（ここが基準）。

```bash
git switch develop
git pull
```

次に自分の作業ブランチへ移動する（例：ログイン機能の実装）

```bash
git switch feature/login
```

`develop` の最新を自分のブランチへ取り込む。

```bash
git merge develop
```

この流れで、作業ブランチは常に `develop` を土台に進められる。

---

## git pull の注意点

`git pull` は「今チェックアウトしているブランチ」に対して動く。

* ローカルで `feature/login` にいる状態で、そのブランチを push して運用している（`origin/feature/login` がある）なら、`origin/feature/login` から pull する
* 作業ブランチがローカル専用で、リモートに存在しない場合は `git pull` しても引く先がない
  → この場合は `develop` を最新化してから、自分のブランチへ `merge` する（上のルーティン通り）

---

## ローカルで動作確認する手順

1. Docker Desktop を起動する
2. ターミナルでDBを起動する

```bash
docker-compose up -d
```

3. 開発サーバーを起動する

```bash
npm run dev
```

4. 表示されたURL（例: [http://localhost:3000](http://localhost:3000) ）を開き、ローカルの変更が反映されているか確認する

---

## push の手順

push前に「今どのブランチにいるか」を必ず確認する。

```bash
git branch
```

ブランチを移動する場合は `switch`。<br>
例：ログイン機能開発のブランチに移動する際

```bash
git switch feature/login
```

ブランチを新しく作る場合は `checkout -b`。

```bash
git checkout -b feature/login
```

差分を確認する。

```bash
git status
```

問題なければステージする（`.` は全ファイルが対象）。

```bash
git add .
```

もう一度 `status` を確認する（赤が緑になっていればOK）。

```bash
git status
```

コミットする。

```bash
git commit -m "ログイン画面のUIを調整"
```

作業ブランチをpushする（原則 `develop` や `main` には push しない）。

```bash
git push origin feature/login
```

---

## PR（Pull Request）でのマージルール

### 通常リリース（feature → develop → main）

基本は以下の順で進める。

1. `feature/*` → `develop` にPRを出してマージ
2. `develop` のプレビュー環境で確認（※現状 kazuki しか見れないので連絡して👍）
3. 問題なければ `develop` → `main` にPRを出してマージ
4. `main` が更新されると本番環境へデプロイされる（※現状 kazuki しか見れないので連絡して👍）
5. マージ済みの `feature/*` ブランチは削除する

### 緊急リリース（hotfix）

本番で緊急度の高いバグが見つかった場合は以下。

1. `main` を最新化して `hotfix/*` を作成（`main` から checkout）
2. 修正して `hotfix/*` → `main` にPRを出してマージ
3. `main` が更新されると本番環境へデプロイされる
4. `main` の修正を `develop` へバックマージ（取り込み漏れ防止）
5. マージ済みの `hotfix/*` ブランチは削除する

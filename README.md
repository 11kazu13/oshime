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

### TanStack Startとは

TanStack Routerをベースとしたフルスタックフレームワーク。

概要を掴む際は、AIに聞くか以下の動画がわかりやすい。  
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

メモは短くてよいが、後で見返して分かること、他の人が見ても作業内容を把握できることを意識する。

---

## 開発ガイド

コマンド操作はターミナルで行う。  
`git` / `docker` / `npm` などはすべてターミナルで扱う。

### 初回の構築ステップ

通常は初回のみ実施する。すでにローカルにリポジトリがある場合は `git clone` は不要。

#### 1. リポジトリをクローン

```bash
git clone <repository_url>
cd oshime
```

#### 2. 依存関係をインストール

```bash
npm install
```

#### 3. ローカルDB（Docker）を起動

Docker Desktopが起動していることを確認してから実行する。

```bash
docker compose up -d
```

#### 4. 環境変数を設定

プロジェクトルートに `.env.local` を作成し、DockerのローカルDBに向けた接続URLを設定する。

```env
DATABASE_URL="postgresql://postgres:password@localhost:54322/oshime_development"
```

#### 5. データベーススキーマを反映

```bash
npm run db:push
```

#### 6. 開発サーバーを起動

```bash
npm run dev
```

ターミナルに表示されたURLを開いて、ローカルサイトを確認する。

---

## 環境構成

本番データの保護と安全なリリースサイクルのため、DB（Supabase）を物理的に2つに分離し、GitHubブランチとVercelのデプロイ環境を同期させる。

### データベース

- `oshime-production`：本番環境用DB
- `oshime-staging`：ステージング / チーム開発・テスト用DB

### ブランチとデプロイ環境

| ブランチ | 用途 | 接続先DB |
| --- | --- | --- |
| `main` | 本番公開用 | `oshime-production` |
| `develop` | チーム内でのコード統合、リリース前テスト | `oshime-staging` |
| `feature/*` | 通常の機能開発、改善、緊急ではないバグ修正 | ローカルDB |
| `hotfix/*` | 本番で見つかった緊急度の高い不具合対応 | 原則、本番に近い状態で確認 |

---

## ブランチ戦略

### `main`

- 本番公開用ブランチ
- `develop` で検証済みのものだけをPRでマージする
- 直接コミット、直接pushはしない
- ただし、`git pull` で最新化するのはOK
- 緊急修正時のみ `hotfix/*` からPRでマージされる

### `develop`

- 通常開発の基準となるブランチ
- `feature/*` は基本的に `develop` から作成する
- チーム内でコードを統合し、ステージングで確認するためのブランチ

### `feature/*`

- 通常の機能開発用ブランチ
- `develop` から作成する
- 開発完了後は `develop` にPRを出してマージする
- マージ後は削除する

命名例:

- `feature/login`
- `feature/artist-register`

### `hotfix/*`

- 緊急バグ修正用ブランチ
- `main` から作成する
- 修正後は `main` にPRを出してマージする
- `main` に入れた修正は、取り込み漏れ防止のため `develop` にも反映する
- マージ後は削除する

命名例:

- `hotfix/payment-error`
- `hotfix/login-bug`

---

## 2人開発の基本ルール

- 作業を始める前に、タスク管理表にやることを書く
- 通常開発は `develop` を基準に進める
- 緊急修正だけ `main` を基準に進める
- `main` や `develop` で直接作業しない
- 実際の作業は必ず `feature/*` または `hotfix/*` で行う
- マージ後は不要になった作業ブランチを削除する
- 通常運用では `develop` → `main` の一方向でリリースする
- `main` → `develop` の反映は、`hotfix/*` を `main` に入れたときだけ行う
- `main` と `develop` を毎回双方向にマージして揃えようとしない

---

## 作業開始時の流れ

### 通常開発

#### 1. `develop` を最新化する

```bash
git switch develop
git pull
```

#### 2-A. すでに作業ブランチがある場合

例: `feature/login` がすでにある場合

```bash
git switch feature/login
git merge develop
```

これで、既存の作業ブランチに `develop` の最新を取り込める。

#### 2-B. まだ作業ブランチがない場合

新しく作業を始めるときは、最新の `develop` から作業ブランチを作る。

```bash
git switch develop
git pull
git switch -c feature/login
```

これで `feature/login` を新規作成できる。

### 緊急修正

本番で緊急度の高いバグが見つかった場合は、`main` を基準に `hotfix/*` を作る。

```bash
git switch main
git pull
git switch -c hotfix/login-bug
```

---

## `git pull` の考え方

`git pull` は、今チェックアウトしているブランチに対して実行される。

### 例1: `develop` を最新化したい場合

```bash
git switch develop
git pull
```

### 例2: `main` を最新化したい場合

```bash
git switch main
git pull
```

`main` を `pull` すること自体は問題ない。  
ダメなのは、`main` で直接作業してそのまま commit / push すること。

### 例3: 自分の作業ブランチを `pull` する場合

すでに `origin/feature/login` が存在していて、そのブランチを自分でも使っているなら、`feature/login` 上で `git pull` してよい。

```bash
git switch feature/login
git pull
```

### 例4: ローカル専用ブランチの場合

まだリモートに存在しない作業ブランチでは、`git pull` しても引く先がない。  
その場合は、`develop` を最新化してから自分のブランチへ取り込む。

```bash
git switch develop
git pull
git switch feature/login
git merge develop
```

---

## ローカルで動作確認する手順

### 1. Docker Desktopを起動する

### 2. DBを起動する

```bash
docker compose up -d
```

### 3. 開発サーバーを起動する

```bash
npm run dev
```

### 4. ブラウザで確認する

表示されたURL（例: `http://localhost:3000`）を開き、ローカルの変更が反映されているか確認する。

---

## pushの手順

push前に、必ず今いるブランチを確認する。

### 1. 現在のブランチを確認

```bash
git branch
```

### 2. 必要なら作業ブランチへ移動

```bash
git switch feature/login
```

### 3. まだブランチがなければ新規作成

```bash
git switch -c feature/login
```

### 4. 差分を確認

```bash
git status
```

### 5. ステージする

```bash
git add .
```

### 6. もう一度確認

```bash
git status
```

### 7. コミットする

```bash
git commit -m "ログイン画面のUIを調整"
```

### 8. 作業ブランチをpushする

```bash
git push origin feature/login
```

原則として、`develop` や `main` には直接pushしない。

---

## PRでのマージルール

### 通常リリース

通常の機能開発は以下の流れで進める。

1. `feature/*` で作業する
2. `feature/*` から `develop` にPRを出してマージする
3. `develop` のプレビュー環境で確認する
4. 問題なければ `develop` から `main` にPRを出してマージする
5. `main` が更新されると本番環境へデプロイされる
6. マージ済みの `feature/*` ブランチは削除する

### 緊急リリース

本番で緊急度の高いバグが見つかった場合は以下の流れで進める。

1. `main` を最新化する
2. `main` から `hotfix/*` を作成する
3. 修正後、`hotfix/*` から `main` にPRを出してマージする
4. `main` が更新されると本番環境へデプロイされる
5. `main` に入った修正を `develop` にも反映する
6. マージ済みの `hotfix/*` ブランチは削除する

### マージ時の補足

- 通常運用では、`develop` を `main` にリリースする流れを基本にする
- 毎回 `main` を `develop` に戻して同期しようとすると、マージコミットが増えて履歴が複雑になりやすい
- そのため、`main` → `develop` の反映は hotfix のときだけにする
- 通常リリースのたびに `main` と `develop` を完全一致させる必要はない

---

## ahead / behind の見方

GitHubでは、あるブランチが比較対象のブランチに対して何コミット進んでいるか、何コミット遅れているかが表示されることがある。

- `ahead` = そのブランチにしかないコミットがある
- `behind` = 比較対象のブランチにあるコミットが、そのブランチにはまだない

### `develop` が `main` より ahead の場合

例: `develop is 3 commits ahead of main`

- 意味: `develop` に本番未反映の変更がある
- 基本的には正常
- まだ本番に出したくないなら、そのままでよい
- 本番に出してよい状態なら `develop` → `main` のPRを出す

### `develop` が `main` より behind の場合

例: `develop is 1 commit behind main`

- 意味: `main` に入っている変更が `develop` にまだ入っていない
- 特に hotfix 後に起こりやすい
- この場合は確認した方がよい
- hotfix を `main` に入れたあとであれば、`main` の修正を `develop` に反映する

### `main` が `develop` より behind の場合

例: `main is 5 commits behind develop`

- 意味: `develop` にある変更が、まだ `main` に入っていない
- 通常は問題ない
- まだリリース前ならそのままでよい
- 本番に出すタイミングで `develop` → `main` を行う

### `feature/*` が `develop` より ahead の場合

- 意味: 作業ブランチ上で開発が進んでいる
- 正常
- 作業完了後に `feature/*` → `develop` のPRを出す

### `feature/*` が `develop` より behind の場合

- 意味: `develop` に新しい変更が入ったが、自分の作業ブランチへまだ取り込んでいない
- 放置しすぎるとコンフリクトの原因になる
- 作業再開時やPR前に、`develop` を取り込むとよい

```bash
git switch develop
git pull
git switch feature/login
git merge develop
```

### `hotfix/*` が `main` より ahead の場合

- 意味: 緊急修正ブランチで作業している状態
- 正常
- 修正完了後に `hotfix/*` → `main` のPRを出す

### `main` と `develop` の両方で ahead / behind が出る場合

例: `develop is 1 commit ahead, 1 commit behind main`

- 意味: `main` と `develop` がそれぞれ相手にないコミットを持っている
- 双方向のマージを繰り返したときに起こりやすい
- 実ファイル差分が少なくても、マージコミットの差で表示されることがある
- 毎回この状態になる場合は、運用を見直した方がよい

### どの表示に対応するべきか

#### 基本的に問題ないことが多い表示

- `develop` が `main` より ahead
- `feature/*` が `develop` より ahead
- `hotfix/*` が `main` より ahead

これらは「未リリース」または「作業中」を意味することが多い。

#### 確認した方がよい表示

- `develop` が `main` より behind
- `feature/*` が `develop` より behind

これらは「取り込むべき変更がまだ入っていない」可能性がある。

#### 運用を見直した方がよい表示

- `main` と `develop` の両方で ahead / behind が出る
- `develop` を `main` にマージしても、またすぐ逆方向の差分表示が出る

この場合は、`main` と `develop` を双方向に毎回マージしている可能性がある。  
通常運用では `develop` → `main` を基本にし、`main` → `develop` は hotfix のときだけにする。

---

## ブランチの削除方法

ブランチ削除は、ローカルとリモートでコマンドが異なる。

### ローカルブランチを削除

マージ済みの場合:

```bash
git branch -d ブランチ名
```

未マージでも強制削除する場合:

```bash
git branch -D ブランチ名
```

### リモートブランチを削除

```bash
git push origin --delete ブランチ名
```

### 注意

今いるブランチは削除できないので、先に別のブランチへ移動する。

```bash
git switch develop
```

---

## よくある開発フローの例

### 例1: 新しくログイン機能を作る場合

```bash
git switch develop
git pull
git switch -c feature/login
```

作業後:

```bash
git add .
git commit -m "ログイン機能を追加"
git push origin feature/login
```

その後、`feature/login` → `develop` にPRを出す。

### 例2: 既存の作業ブランチを再開する場合

```bash
git switch develop
git pull
git switch feature/login
git merge develop
```

### 例3: 本番の緊急バグを修正する場合

```bash
git switch main
git pull
git switch -c hotfix/login-bug
```

作業後、`hotfix/login-bug` → `main` にPRを出す。  
その後、`main` に入った修正を `develop` にも反映する。

---

## 補足

- `main` は pullしてよい
- `develop` も pullしてよい
- ダメなのは、`main` や `develop` を作業ブランチ代わりに使うこと
- 普段の開発は `develop` から `feature/*` を切る
- 緊急修正だけ `main` から `hotfix/*` を切る
- 通常運用では `develop` → `main` を基本にする
- `main` → `develop` は hotfix のときだけにする
- `main` と `develop` を毎回双方向にマージして完全同期しようとしない

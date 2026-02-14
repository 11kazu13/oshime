# Oshime Project

推し活版 @cosme プロジェクトの開発環境です。

## 🚀 環境構築 (Setup)

### 1. リポジトリのクローン

```bash
git clone https://github.com/11kazu13/oshime.git
cd oshime
```

### 2. Dockerの起動

初回はビルドが走るため時間がかかります。

```bash
docker compose up --build
```

### 3. データベースの作成（初回のみ）

`docker compose up` のログが流れているのとは**別のターミナル**を開いて実行してください。

```bash
docker compose exec api bin/rails db:create db:migrate
```

アクセス:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:3000>

## 🛠 よく使うコマンド

- **Railsコンソール**: `docker compose exec api bin/rails c`
- **バックエンドに入る**: `docker compose exec api bash`
- **フロントエンドに入る**: `docker compose exec frontend bash`

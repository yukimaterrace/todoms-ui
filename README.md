# todoms-ui

Todomsはシンプルかつ効率的なタスク管理アプリケーションです。このリポジトリはTodomのフロントエンドUIのソースコードを含んでいます。

## 概要

todoms-uiは、Next.jsとMaterial UIを使用して構築された、モダンでレスポンシブなTODO管理アプリケーションのフロントエンドです。ユーザー認証機能を備え、TODOアイテムの作成、管理、追跡を簡単に行うことができます。

## 技術スタック

- **フレームワーク**: [Next.js 15](https://nextjs.org/) (with Turbopack)
- **UIライブラリ**: [Material UI 7](https://mui.com/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **状態管理**: Reactコンテキスト
- **認証**: JWTトークンベース認証
- **スタイリング**: [Emotion](https://emotion.sh/)
- **日付処理**: [Date-fns](https://date-fns.org/)

## 機能

- **ユーザー認証**
  - ユーザー登録
  - ログイン/ログアウト
  - トークンベース認証 (JWT)
  
- **TODO管理**
  - TODO一覧の表示
  - TODOの作成
  - TODOの詳細表示・編集
  - TODOの完了/未完了状態の切り替え
  - TODOの削除
  
- **追加機能**
  - 期限日の設定と表示
  - TODO検索
  - 並べ替え (更新日、期限日、タイトル、完了状態)

## プロジェクト構成

```
todoms-ui/
├── app/                 # Next.jsのアプリケーションルーター
│   ├── auth/            # 認証関連ページ
│   └── todos/           # TODOページ
├── components/          # 再利用可能なReactコンポーネント
├── config/              # アプリケーション設定
├── lib/                 # ユーティリティやAPI関連コード
└── public/              # 静的アセット
```

## 開発環境のセットアップ

### 前提条件

- Node.js (18.x以上)
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/todoms-ui.git
cd todoms-ui

# 依存パッケージのインストール
npm install
# または
yarn install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動 (Turbopackを使用)
npm run dev
# または
yarn dev
```

開発サーバーは http://localhost:3000 で実行されます。

### ビルド

```bash
# プロダクション用ビルドの作成
npm run build
# または
yarn build

# ビルドしたアプリケーションの実行
npm run start
# または
yarn start
```

## ライセンス

[MITライセンス](LICENSE)

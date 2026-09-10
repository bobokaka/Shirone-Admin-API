---
title: 公開と検証
description: /api/publish/* の公開プレビュー、リモート probe、ワンクリック公開と、/api/validate の dry-run 検証の API リファレンス。
---

# 公開と検証

公開モジュールは 2リポジトリ（コンテンツリポジトリ + テーマリポジトリ）の git 操作をラップします。2つのリポジトリは**互いにブロックせず**、それぞれ独立した `RepoPublishResult` を返します。

## GET /api/publish/preview

公開ページの初期データ：2リポジトリの変更明細、自動生成されたコミットメッセージ、最近のコミットと状態。パラメーターなし。

**戻り値** `PublishPreview` の主要フィールド：

| フィールド | 説明 |
|------|------|
| `branch` / `ahead` / `behind` | コンテンツリポジトリのブランチと先行/遅延（ローカルキャッシュ値） |
| `changes` / `files` | コンテンツリポジトリの変更明細 `{ path, state: "new" \| "modified" }[]` とファイル一覧 |
| `message` | コンテンツリポジトリの自動コミットメッセージ |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | テーマリポジトリの対応情報（未接続時 `themeStatus` は `null`） |
| `themeDepsInstalled` | テーマの依存がインストール済みか（ローカル検証の可否を決定） |
| `recent` | コンテンツリポジトリの直近 20件のコミット `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

軽量なリモート比較：`git ls-remote` でブランチの tip を比較し、**コード/オブジェクトは一切取得しません**。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `repo` | `"content" \| "theme"` | はい | どちらのリポジトリを probe するか |

**戻り値** `RemoteProbe`：`{ behind: number | null }`——`0` はリモートと一致。`>0` は正確な遅延数。`null` はリモートが進んでいるが数は不明（取得後に確定）。

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

ワンクリック公開。フロー：コンテンツリポジトリ（**検証 → add -A → commit → pull --rebase --autostash → push**。検証失敗ならそのリポジトリをブロック）+ テーマリポジトリ（commit → push。ローカル検証は実行しない）。

| Body フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `contentMessage` | `string` | いいえ | コンテンツリポジトリのコミットメッセージ。**空欄なら自動生成**（`type(scope): ≤30文字` に準拠する必要あり） |
| `themeMessage` | `string` | いいえ | テーマリポジトリのコミットメッセージ。同上 |

**戻り値** `PublishResult`：

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

各リポジトリの `RepoPublishResult`：`ok`（そのリポジトリ全体の成功）、`hadChanges`、`commitHash?`、`pushed`、`validationOutput?`（コンテンツリポジトリの検証失敗時の完全なログ）、`log[]`（ステップごとの実行記録）。最上位の `ok = content.ok && theme.ok` です。

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> これは実際に git コミットとプッシュを発生させる API です。呼び出し前に `preview` で変更範囲を確認することをおすすめします。コンテンツリポジトリの検証に失敗した場合、コミットは一切発生しません。

## POST /api/validate

公開前検証だけを単独で実行します：テーマリポジトリで `scripts/content/sync.mjs --dry-run` を実行します（環境に `CONTENT_DIR` を付与、180秒タイムアウト、出力は末尾 4000文字で切り詰め）。**純メモリの事前検査で、ディスクに書かず、いかなる変更も発生させません**。

**戻り値** `{ ok: boolean, output: string }`——`output` は検証器の出力です（YAML フォーマット、フィールドの綴り、frontmatter スキーマの問題箇所の特定）。

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```

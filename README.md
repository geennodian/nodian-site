# 株式会社NODIAN コーポレートサイト

STUDIOで作成していたサイト（gold621218.studio.site）を、維持費ゼロで運用するために静的サイト（HTML/CSS/JS）として再構築したものです。

## 構成

- `index.html` — 全セクション（Mission / Service / Value / Works / Company / Recruit / Contact）を含む1ページ構成
- `style.css` — スタイル一式（レスポンシブ対応）
- `script.js` — ハンバーガーメニューとスクロールフェードイン
- `assets/` — ロゴ・写真

外部依存はGoogle Fonts（無料）とFormSubmit（無料のフォーム送信サービス）のみ。ビルド不要でそのまま公開できます。

## 無料で公開する方法（GitHub Pages）

```bash
cd nodian-site
gh repo create nodian-site --public --source=. --push
gh api repos/{owner}/nodian-site/pages -X POST -f build_type=workflow 2>/dev/null || true
```

またはGitHubの画面から: リポジトリ → Settings → Pages → Branch: `main` / `(root)` → Save。
数分で `https://<アカウント名>.github.io/nodian-site/` で公開されます。

### 独自ドメイン（nodi-an.com など）を使う場合

1. リポジトリ → Settings → Pages → Custom domain にドメインを入力
2. ドメイン管理側でDNSを設定（CNAMEレコード: `<アカウント名>.github.io`）
3. ドメイン代（年1,000〜2,000円程度）以外の費用はかかりません

## お問い合わせフォームについて

フォームは [FormSubmit](https://formsubmit.co/)（無料）を使い、`g.sugimura@nodi-an.com` にメールが届く設定です。

- **初回のみ**: 最初の送信時にFormSubmitから確認メールが届くので、リンクをクリックして有効化してください
- 有効化後、メールアドレスを隠したい場合はFormSubmitが発行するランダムなエイリアスに `index.html` の `action` を書き換えられます
- 宛先を変えたい場合は `index.html` 内の `formsubmit.co/...` の部分を編集してください

## 更新方法

HTMLを直接編集して push するだけで反映されます。

```bash
git add -A && git commit -m "update" && git push
```

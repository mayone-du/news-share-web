# ニュースシェアアプリの Web フロント

https://api.slack.com/legacy/oauth

## Packages

- Next.js
- TypeScript
- Tailwind CSS
- Headless UI
- React Hot Toast
- React Icons
- React Hook Form
- NextAuth
- NextSEO
- next-sitemap
- GraphQL
- Apollo Client
- GraphQL Code Generator
- Jest
- ESLint
- Prettier

## SetUp

- Create /.env.local
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
- npm build
- npm start

## TODO:

- フロント側にスクレイピング機能をもたせて、投稿前にプレビューできるようにする
- 問い合わせページと GitHub Issues とか連携させて、欲しい機能やバグの報告をできるようにする(プラスで Slack に通知したり、Slack から送信できるのもあり)
- KBar と独自モーダルがかぶって見にくくなるので対応
- GitHub みたいに、ニュースを共有してくれた人を「ニュースコントリビューター」的な感じで表示するのいいかも。色々メリットありそう

<!-- ```
      <ul className="py-4 pr-4 pl-8 text-sm list-disc text-gray-600 rounded border">
        <h4 className="text-sm font-bold text-gray-700">TODO:</h4>
        <li>拡張機能でDOM経由でoViceのチャットを拾い、このAPIに投げて複製、表示</li>
        <li>しまぶーさんのみ、拡張機能からリクエストできる。API側でもバリデーション</li>
        <li>
          懸念事項としては、メッセージが重複してしまうことや、チャット欄を閉じた状態でDOMにアクセスできるのか、などなど
        </li>
        <li>
          拡張機能からoViceにどうにかリクエストなげてチャットを取得できるなら、それでフィルタリングするなどしてフロントのAPIルートで受け取るとかでもいいかも
        </li>
      </ul>
``` -->

## Note

subscription が必要な場合は以下パッケージをインストールして apollo client の初期化部分のコメントを解除

- "subscriptions-transport-ws": "^0.9.19"

ngrok を使用する。

```terminal
cd Desktop
./ngrok http 3000
```

起動した https のアドレスを、.env.local と slack の redirect_uri に設定する。

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

## Note

subscription が必要な場合は以下パッケージをインストールして apollo client の初期化部分のコメントを解除

- "subscriptions-transport-ws": "^0.9.19"

ngrok を使用する。

```terminal
cd Desktop
./ngrok http 3000
```

起動した https のアドレスを、.env.local と slack の redirect_uri に設定する。

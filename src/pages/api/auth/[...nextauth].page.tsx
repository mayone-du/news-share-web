import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { initializeApollo } from "src/graphql/apollo/client";
import type {
  SocialAuthMutation,
  SocialAuthMutationVariables,
} from "src/graphql/schemas/generated/schema";
import { SocialAuthDocument } from "src/graphql/schemas/generated/schema";

// TODO: 各引数で受け取る値の型の修正

/* eslint-disable @typescript-eslint/naming-convention */
const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
// アクセストークンのリフレッシュ用非同期関数
const refreshAccessToken = async (token: any) => {
  // console.log("refreshAccessTokenが呼ばれました");
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      idToken: refreshedTokens.id_token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("refreshAccessTokenError", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

// eslint-disable-next-line import/no-default-export
export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorizationUrl: GOOGLE_AUTHORIZATION_URL,
      // scope: "",
    }),
  ],
  callbacks: {
    // サインイン時の処理
    signIn: async (params) => {
      // 初回サインイン時にDBにユーザーを登録し、二回目以降はユーザーが存在すればOKにする
      // const apolloClient = initializeApollo(null, params.account.id_token);
      const apolloClient = initializeApollo(null, params.account.idToken);

      // TODO: ここは絶対かわる
      const { errors } = await apolloClient.mutate<SocialAuthMutation, SocialAuthMutationVariables>(
        {
          mutation: SocialAuthDocument,
          variables: {
            // accessToken: params.account.access_token,
            accessToken: params.account.accessToken,
          },
        },
      );

      // SocialAuthのエラーが無ければOK
      if (errors) {
        console.error(errors);
        return false;
      } else {
        return true;
      }
    },

    // リダイレクト時の処理 普通にページ遷移した時に呼び出されるぽい？
    redirect: async (params) => {
      // eslint-disable-next-line no-console
      return params.url.startsWith(params.baseUrl) ? params.url : params.baseUrl;
    },

    // TODO: 要チェック
    jwt: async (params) => {
      // eslint-disable-next-line no-console
      // console.log("NextAuth jwt fn", token, user, account, _profile, _isNewUser);

      // ユーザー情報がすでにある場合？
      if (params.account && params.user) {
        return {
          idToken: params.account.id_token,
          accessToken: params.account.accessToken,
          // accessTokenExpires: Date.now() + params.account.expires_at * 1000,
          accessTokenExpires: Date.now() + params.account.expires_in * 1000,
          refreshToken: params.account.refresh_token,
          user: params.user,
        };
      }

      // トークンの期限を確認。有効期限内であればトークンをそのまま返却
      // Return previous token if the access token has not expired yet
      if (Date.now() < params.token.accessTokenExpires) {
        // console.log("トークンは有効です。");
        return params.token;
      }

      // console.log("トークンは無効です。");
      // アクセストークンの期限が切れていたら更新してその値を返す
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    session: async (params) => {
      // tokenが存在する場合はidTokenなどをセットする
      if (params.token) {
        params.session.user = params.token.user;
        params.session.idToken = params.token.idToken;
        params.session.accessToken = params.token.accessToken;
        params.session.error = params.token.error;
      }
      return params.session;
    },
  },
});

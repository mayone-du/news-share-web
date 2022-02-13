import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import { SLACK_ENV_VARS } from "src/constants";
import { initializeApollo } from "src/graphql/apollo/client";

// TODO: 各引数で受け取る値の型の修正

export default NextAuth({
  providers: [
    SlackProvider({
      clientId: SLACK_ENV_VARS.SLACK_CLIENT_ID,
      clientSecret: SLACK_ENV_VARS.SLACK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // サインイン時の処理
    signIn: async (params) => {
      console.log(params);
      // 初回サインイン時にDBにユーザーを登録し、二回目以降はユーザーが存在すればOKにする
      const apolloClient = initializeApollo();

      // TODO: ここは絶対かわる
      // const { errors } = await apolloClient.mutate<SocialAuthMutation, SocialAuthMutationVariables>(
      //   {
      //     mutation: SocialAuthDocument,
      //     variables: {
      //       accessToken: params.account.access_token ?? "",
      //     },
      //   },
      // );
      return true;
    },

    // リダイレクト時の処理 普通にページ遷移した時に呼び出されるぽい？
    redirect: async (params) => {
      return params.url.startsWith(params.baseUrl) ? params.url : params.baseUrl;
    },

    jwt: async (params) => {
      // console.log("jwt", params);
      return params.token;
    },

    // TODO: 要チェック
    // jwt: async (params) => {
    //   // eslint-disable-next-line no-console
    //   // console.log("NextAuth jwt fn", token, user, account, _profile, _isNewUser);

    //   // ユーザー情報がすでにある場合？
    //   if (params.account && params.user) {
    //     return {
    //       token: params.token,
    //       user: params.user,
    //       account: params.account,
    //       profile: params.profile,
    //       isNewUser: params.isNewUser,
    //     };
    //     return {
    //       // idToken: params.account.id_token,
    //       // accessToken: params.account.accessToken,
    //       // accessTokenExpires: Date.now() + params.account.expires_at * 1000,
    //       // accessTokenExpires: Date.now() + (params.account.expires_at ?? 0) * 1000,
    //       // refreshToken: params.account.refresh_token,
    //       // user: params.user,
    //     };
    //   }
    // },

    session: async (params) => {
      // console.log("NextAuth session fn", params);
      return params.session;
    },
  },
});

import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import { SLACK_ENV_VARS } from "src/constants";
import { initializeApollo } from "src/graphql/apollo/client";

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
      console.log("access_token", params.account.access_token);
      // accessTokenVar(params.account.access_token);
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
      // console.log("jwt callbacks", params);
      // if (typeof params.token.access_token === "string") {
      //   console.log("access_token", params.token.access_token);
      //   accessTokenVar(params.token.access_token);
      // }
      return params.token;
    },

    session: async (params) => {
      // useSession時にsession.access_tokenでaccess_tokenを取得できるようにする
      return { ...params.session, access_token: params.token.access_token };
    },
  },
});

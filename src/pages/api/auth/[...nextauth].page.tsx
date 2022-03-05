import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import { SLACK_ENV_VARS } from "src/constants";
import { initializeApollo } from "src/graphql/apollo/client";
import {
  AuthUserDocument,
  AuthUserMutation,
  AuthUserMutationVariables,
} from "src/graphql/schemas/generated/schema";

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
      try {

      // 初回サインイン時にDBにユーザーを登録し、二回目以降はユーザーが存在すればOKにする
      const apolloClient = initializeApollo(params.account.access_token);
      const { errors } = await apolloClient.mutate<AuthUserMutation, AuthUserMutationVariables>({
        mutation: AuthUserDocument,
      });
      if (errors) {
        console.error(errors);
        return false;
      }
      return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },

    // リダイレクト時の処理 普通にページ遷移した時に呼び出されるぽい？
    redirect: async (params) => {
      return params.url.startsWith(params.baseUrl) ? params.url : params.baseUrl;
    },

    jwt: async (params) => {
      if (params.account) {
        params.token.access_token = params.account.access_token;
      }
      return params.token;
    },

    session: async (params) => {
      // useSession時にsession.access_tokenでaccess_tokenを取得できるようにする
      return { ...params.session, access_token: params.token.access_token };
    },
  },
});

import { InMemoryCache, NormalizedCacheObject, useReactiveVar } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { getSession } from "next-auth/react";
import { GRAPHQL_API_ENDPOINT } from "src/constants";
import { cache } from "src/graphql/apollo/cache";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const authLink = setContext(async (request, previousContext) => {
  const session = await getSession();
  // TODO: ここらへんの型が安全じゃないからなにか出来ないか調べる。next auth側の方とかないのかな
  const token = session?.id_token;
  // initializeApolloでtokenを渡した場合に空文字で上書きさせないようにしている
  if (token) return { headers: { authorization: `Bearer ${token}` } };
  return { headers: previousContext.headers };
});

// ApolloClientの作成
const createApolloClient = (token?: string) => {
  // 画像をアップロードするためにcreateUploadLinkを使う
  const newHttpLink = createUploadLink({
    uri: GRAPHQL_API_ENDPOINT,
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(newHttpLink),
    cache,
  });
};

// ApolloClientの初期化
export const initializeApollo = (token?: string) => {
  const _apolloClient = apolloClient ?? createApolloClient(token);
  // SSR時は新しいclientを作成
  if (typeof window === "undefined") return _apolloClient;
  // CSR時は同じクライアントを使い回す
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

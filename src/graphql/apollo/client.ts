import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { GRAPHQL_API_ENDPOINT } from "src/constants";
import { cache } from "src/graphql/apollo/cache";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const authLink = setContext((operation, { headers }) => {
  return { headers };
});

// ApolloClientの作成
const createApolloClient = () => {
  // 画像をアップロードするためにcreateUploadLinkを使う
  const newHttpLink = createUploadLink({
    uri: GRAPHQL_API_ENDPOINT,
    // idTokenが存在していれば値をセット
    headers: { authorization: `Bearer token` },
    // headers: { authorization: `Bearer token` },
  });
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(newHttpLink),
    cache,
  });
};

// ApolloClientの初期化
export const initializeApollo = (_initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();
  // SSR時は新しいclientを作成
  if (typeof window === "undefined") return _apolloClient;
  // CSR時は同じクライアントを使い回す
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

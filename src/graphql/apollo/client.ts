import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { GRAPHQL_API_ENDPOINT } from "src/constants";
import { cache } from "src/graphql/apollo/cache";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

// // SubscriptionのWebSocketリンク SSRが不可のため、Client側でのみ動くようにする
// const wsLink = process.browser
//   ? new WebSocketLink({
//       uri: "ws://localhost:8000/subscriptions",
//       options: {
//         reconnect: true,
//       },
//     })
//   : undefined;

// TODO: ↓いらないかも
const authLink = setContext((operation, { headers }) => {
  return { headers };
});

// ApolloClientの作成
const createApolloClient = (idToken: string | undefined /* 引数でidTokenを受け取る */) => {
  // 画像をアップロードするためにcreateUploadLinkを使う
  const newHttpLink = createUploadLink({
    uri: GRAPHQL_API_ENDPOINT,
    // idTokenが存在していれば値をセット
    headers: {
      authorization: idToken ? `Bearer ${idToken}` : "",
    },
  });
  // QueryとMutationならHttpLinkを使用し、SubscriptionならWebSocketLinkを使用する
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    // wsLink ? wsLink : authLink.concat(newHttpLink),
    // wsLink as WebSocketLink,
    authLink.concat(newHttpLink),
  );
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: splitLink,
    cache: cache,
  });
};

// ApolloClientの初期化
export const initializeApollo = (_initialState = null, idToken: string | undefined) => {
  const _apolloClient = apolloClient ?? createApolloClient(idToken);
  // SSR時は新しいclientを作成
  if (typeof window === "undefined") return _apolloClient;
  // CSR時は同じクライアントを使い回す
  // if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  // pageProps: AppProps["pageProps"],
  pageProps: any,
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }
  return pageProps;
};

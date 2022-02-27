export const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";

// TODO: 使用してない環境変数は削除
const SLACK_CLIENT_ID =
  (isProd ? process.env.SLACK_CLIENT_ID : process.env.DEV_SLACK_CLIENT_ID) ?? "";
const SLACK_CLIENT_SECRET =
  (isProd ? process.env.SLACK_CLIENT_SECRET : process.env.DEV_SLACK_CLIENT_SECRET) ?? "";
const SLACK_REDIRECT_URL =
  (isProd ? process.env.SLACK_REDIRECT_URL : process.env.DEV_SLACK_REDIRECT_URL) ?? "";
// const DEV_SLACK_API_ENDPOINT = process.env.DEV_SLACK_API_ENDPOINT ?? "";

export const SLACK_ENV_VARS = {
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_REDIRECT_URL,
} as const;

const NEXT_PUBLIC_DEV_GRAPHQL_API_URL = process.env.NEXT_PUBLIC_DEV_GRAPHQL_API_URL;
const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL;

export const GRAPHQL_API_ENDPOINT = isProd ? GRAPHQL_API_URL : NEXT_PUBLIC_DEV_GRAPHQL_API_URL;

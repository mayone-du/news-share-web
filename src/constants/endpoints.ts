import { GRAPHQL_API_URL, NEXT_PUBLIC_DEV_GRAPHQL_API_URL, NODE_ENV } from "src/constants/";

export const GRAPHQL_API_ENDPOINT =
  NODE_ENV === "development" ? `${NEXT_PUBLIC_DEV_GRAPHQL_API_URL}graphql/` : GRAPHQL_API_URL;

export const MEDIAFILE_API_ENDPOINT =
  NODE_ENV === "development" ? `${NEXT_PUBLIC_DEV_GRAPHQL_API_URL}media/` : GRAPHQL_API_URL;

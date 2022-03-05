import type { NewsListQueryVariables } from "src/graphql/schemas/generated/schema";

export type SearchFragKind = "date" | "text";

export type QueryParams = NewsListQueryVariables["input"] & {
  searchFrag: SearchFragKind;
};

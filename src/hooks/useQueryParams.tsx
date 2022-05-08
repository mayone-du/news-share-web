import { useRouter } from "next/router";
import { NewsListInput } from "src/graphql/schemas/generated/schema";
import { QueryParams } from "src/types";

export const useQueryParams = (pickParam: keyof QueryParams) => {
  const { query } = useRouter();
  console.log(query);
  // const currentQuery = query;
  return {
    query,
  };
};

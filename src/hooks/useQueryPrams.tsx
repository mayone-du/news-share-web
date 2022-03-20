import { useRouter } from "next/router";

export const useQueryPrams = () => {
  const { query } = useRouter();
  console.log(query);
  // const currentQuery = query;
  return {
    query,
  };
};

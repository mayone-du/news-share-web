import { makeVar } from "@apollo/client";

// 開発時用のstate
export const developState = makeVar({
  isDevelop: true,
  isLogin: false,
  isLoading: false,
});

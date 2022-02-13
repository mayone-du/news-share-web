import { makeVar } from "@apollo/client";

// ApolloClientにGoogleから渡されるidTokenを渡すためのステート
export const idTokenVar = makeVar("");

// ユーザー情報のローディング・ログイン・IDの状態をグローバル管理するためのステート
const InitialUserInfo = {
  isAuthenticated: false,
  isLoading: true,
  userId: "",
};

export const userInfoVar = makeVar(InitialUserInfo);

// 認証モーダルの開閉用ステート
export const isOpenAuthModalVar = makeVar(false);

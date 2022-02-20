import { makeVar } from "@apollo/client";

// ユーザー情報のローディング・ログイン・IDの状態をグローバル管理するためのステート
const InitialUserInfo = {
  isAuthenticated: false,
  isLoading: true,
  userId: "",
};

export const userInfoVar = makeVar(InitialUserInfo);

// 認証モーダルの開閉
export const isOpenAuthModalVar = makeVar(false);

// ニュース投稿用モーダルの開閉
export const isOpenCreateNewsModalVar = makeVar(false);

import { makeVar } from "@apollo/client";

// 認証モーダルの開閉
export const isOpenAuthModalVar = makeVar(false);

// ニュース投稿用モーダルの開閉
export const isOpenCreateNewsModalVar = makeVar(false);

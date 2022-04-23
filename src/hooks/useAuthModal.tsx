import { useReactiveVar } from "@apollo/client";
import { useCallback } from "react";
import { isOpenAuthModalVar } from "src/global/state";
import { handleSignIn } from "src/utils/handleSignIn";

export const useAuthModal = () => {
  const isOpenAuthModal = useReactiveVar(isOpenAuthModalVar);

  // 認証モーダルの開閉
  const handleOpenAuthModal = useCallback(() => {
    isOpenAuthModalVar(true);
  }, []);
  const handleCloseAuthModal = useCallback(() => {
    isOpenAuthModalVar(false);
  }, []);

  // モーダルの中身のボタンをクリックした時
  const handleClickAuth = useCallback(async () => {
    await handleSignIn();
    handleCloseAuthModal();
  }, []);

  return {
    handleOpenAuthModal,
    handleCloseAuthModal,
    handleClickAuth,
    isOpenAuthModal,
  };
};

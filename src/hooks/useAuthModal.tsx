import { useReactiveVar } from "@apollo/client";
import { useCallback, useState } from "react";
import { isOpenAuthModalVar } from "src/global/state";
import { handleSignIn } from "src/utils/handleSignIn";

export const useAuthModal = () => {
  const isOpenAuthModal = useReactiveVar(isOpenAuthModalVar);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 認証モーダルの開閉
  const handleOpenAuthModal = useCallback(() => {
    isOpenAuthModalVar(true);
  }, []);
  const handleCloseAuthModal = useCallback(() => {
    isOpenAuthModalVar(false);
  }, []);

  // モーダルの中身のボタンをクリックした時
  const handleClickAuth = useCallback(async () => {
    setIsRedirecting(true);
    await handleSignIn();
    handleCloseAuthModal();
  }, []);

  return {
    handleOpenAuthModal,
    handleCloseAuthModal,
    handleClickAuth,
    isOpenAuthModal,
    isRedirecting,
  };
};

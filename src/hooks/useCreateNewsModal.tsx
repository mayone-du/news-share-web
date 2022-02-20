import { useReactiveVar } from "@apollo/client";
import { useCallback } from "react";
import { isOpenCreateNewsModalVar, userInfoVar } from "src/global/state";
import { useAuthModal } from "src/hooks/useAuthModal";

export const useCreateNewsModal = () => {
  const userInfo = useReactiveVar(userInfoVar);
  const { handleToggleAuthModal } = useAuthModal();

  const handleOpenCreateNewsModal = useCallback(() => {
    if (userInfo.isLoading) return;
    if (!userInfo.isAuthenticated) return handleToggleAuthModal();
    isOpenCreateNewsModalVar(true);
  }, [userInfo]);

  const handleCloseCreateNewsModal = useCallback(() => isOpenCreateNewsModalVar(false), []);

  return {
    handleOpenCreateNewsModal,
    handleCloseCreateNewsModal,
  };
};

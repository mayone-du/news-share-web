import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { isOpenCreateNewsModalVar } from "src/global/state";
import { useAuthModal } from "src/hooks/useAuthModal";

export const useCreateNewsModal = () => {
  const { status } = useSession();
  const { handleOpenAuthModal } = useAuthModal();

  const handleOpenCreateNewsModal = useCallback(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return handleOpenAuthModal();
    isOpenCreateNewsModalVar(true);
  }, [status]);

  const handleCloseCreateNewsModal = useCallback(() => isOpenCreateNewsModalVar(false), []);

  return {
    handleOpenCreateNewsModal,
    handleCloseCreateNewsModal,
  };
};

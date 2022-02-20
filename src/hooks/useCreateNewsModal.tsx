import { useReactiveVar } from "@apollo/client";
import { Dialog, Transition } from "@headlessui/react";
import { VFC } from "react";
import { useCallback } from "react";
import { isOpenCreateNewsModalVar, userInfoVar } from "src/global/state";
import { useAuthModal } from "src/hooks/useAuthModal";

export const useCreateNewsModal = () => {
  const isOpenCreateNewsModal = useReactiveVar(isOpenCreateNewsModalVar);
  const userInfo = useReactiveVar(userInfoVar);
  const { handleToggleAuthModal } = useAuthModal();

  const handleOpenCreateNewsModal = useCallback(() => {
    if (userInfo.isLoading) return;
    if (!userInfo.isAuthenticated) return handleToggleAuthModal();
    isOpenCreateNewsModalVar(true);
  }, [userInfo]);

  const handleCloseCreateNewsModal = useCallback(() => isOpenCreateNewsModalVar(false), []);

  // モーダルの中身のボタンをクリックした時
  const handleClick = useCallback(async () => {}, []);

  const CreateNewsModal: VFC = () => {
    return (
      <Transition appear show={isOpenCreateNewsModal} as="div">
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-10 bg-gray-400 bg-opacity-40"
          onClose={handleCloseCreateNewsModal}
        >
          <div className="flex justify-center items-center px-4 min-h-screen">
            <Transition.Child
              as="div"
              enter="ease-out duration-50"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as="div"
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="overflow-hidden p-6 m-auto w-80 bg-white rounded-lg shadow-xl transition-all transform sm:w-96">
                <Dialog.Title as="h3" className="text-2xl font-bold text-center text-gray-900">
                  ニュースを投稿する
                </Dialog.Title>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return {
    handleOpenCreateNewsModal,
    handleCloseCreateNewsModal,
    CreateNewsModal,
  };
};

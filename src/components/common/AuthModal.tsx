import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import type { VFC } from "react";
import { STATIC_ROUTES } from "src/constants/routes";
import { useAuthModal } from "src/hooks/useAuthModal";

export const AuthModal: VFC = () => {
  const { isOpenAuthModal, handleToggleAuthModal, handleClickAuth } = useAuthModal();
  return (
    <Transition appear show={isOpenAuthModal} as="div">
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10 bg-gray-400 bg-opacity-40"
        onClose={handleToggleAuthModal}
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
            <div className="overflow-hidden p-8 m-auto w-80 bg-white rounded-lg shadow-xl transition-all transform sm:w-96">
              <Dialog.Title as="h3" className="text-3xl font-bold text-center text-gray-900">
                Qinニュースシェア
              </Dialog.Title>

              <p className="mt-6 text-sm text-gray-500">
                このアプリは
                <a
                  className="underline transition-colors hover:text-blue-500 hover:no-underline mx-1"
                  href="https://it-kingdom.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IT_KINGDOM
                </a>
                で開催されているニュースシェア専用アプリです。Qin国民のみログイン可能ですので、ご注意ください。
              </p>

              <div className="my-6">
                <button
                  type="button"
                  className="flex items-center px-2 mx-auto bg-gray-50 rounded border border-gray-200 ring-blue-200 shadow transition-all outline-none hover:bg-gray-100 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-300 active:ring-2"
                  onClick={handleClickAuth}
                >
                  <img src="/images/Slack_Mark.svg" className="block w-10 h-10" />
                  <span className="mr-4 ml-1 font-bold">SignIn with Slack</span>
                </button>
              </div>

              <p className="text-sm text-gray-500">
                <Link href={STATIC_ROUTES.ABOUT}>
                  <a className="underline transition-colors hover:text-blue-500 hover:no-underline mr-1">
                    注意事項
                  </a>
                </Link>
                を読み、同意したうえでログインしてください
              </p>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

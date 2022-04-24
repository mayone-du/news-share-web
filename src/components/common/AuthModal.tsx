import { Modal, Title, LoadingOverlay } from "@mantine/core";
import Link from "next/link";
import type { VFC } from "react";
import { STATIC_ROUTES } from "src/constants/routes";
import { useAuthModal } from "src/hooks/useAuthModal";

export const AuthModal: VFC = () => {
  const { isOpenAuthModal, isRedirecting, handleCloseAuthModal, handleClickAuth } = useAuthModal();
  return (
    <Modal
      opened={isOpenAuthModal}
      onClose={handleCloseAuthModal}
      centered
      title={
        <Title order={4} align="center">
          Qinニュースシェア
        </Title>
      }
    >
      <LoadingOverlay visible={isRedirecting} />

      <p className="mt-6 text-sm text-gray-500">
        このアプリは
        <a
          className="mx-1 underline transition-colors hover:text-blue-500 hover:no-underline"
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
          <a className="mr-1 underline transition-colors hover:text-blue-500 hover:no-underline">
            注意事項
          </a>
        </Link>
        を読み、同意したうえでログインしてください
      </p>
    </Modal>
  );
};

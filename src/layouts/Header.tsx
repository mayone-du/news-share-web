import { Popover } from "@headlessui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";
import { HEADER_MENUS } from "src/constants/menus/header";
import { STATIC_ROUTES } from "src/constants/routes";
import { useAuthModal } from "src/hooks/useAuthModal";
import type { VFC } from "react";
import { useMyUserInfoQuery } from "src/graphql/schemas/generated/schema";

export const Header: VFC = () => {
  const { data: session, status } = useSession();
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" });
  const { handleToggleAuthModal } = useAuthModal();

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  const PROFILE_MENU_ITEMS = [
    {
      label: "sample",
      href: "##",
    },
    {
      label: "Reports",
      href: "##",
    },
  ];

  return (
    <header className="py-2 border-b md:px-60 lg:px-72">
      <nav className="flex justify-between items-center">
        <div>
          <Link href={STATIC_ROUTES.INDEX}>
            <a className="block text-lg font-bold">LOGO</a>
          </Link>
        </div>
        <ul className="flex justify-between items-center">
          {/* ヘッダーメニューを事前に定義し、mapで回して表示 */}
          {HEADER_MENUS.map((menu) => {
            return (
              <li key={menu.href} className="mx-2">
                <Link href={menu.href}>
                  <a>{menu.label}</a>
                </Link>
              </li>
            );
          })}
          {/* ローディング時 */}
          {status === "loading" && (
            <div className="ml-2 w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          )}
          {/* 非認証時 */}
          {status === "unauthenticated" && (
            <li className="ml-2">
              <div>
                <button
                  onClick={handleToggleAuthModal}
                  className="block py-2 px-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow"
                >
                  SignIn
                </button>
              </div>
            </li>
          )}
          {/* 認証時 */}
          {status === "authenticated" && (
            <li className="ml-2">
              <div className="top-16 mx-auto w-full">
                <Popover className="relative">
                  {({ open: isOpen }) => {
                    return (
                      <div>
                        <Popover.Button
                          className={`ring-blue-300 overflow-hidden rounded-full h-10 w-10 block active:ring hover:shadow-lg border border-gray-300 ${
                            isOpen && "ring"
                          }`}
                        >
                          <img
                            src={session?.user?.image ?? ""}
                            className="block object-cover"
                            alt=""
                          />
                        </Popover.Button>
                        <Popover.Panel className="absolute right-0 z-10 mt-4 w-72 bg-white rounded border shadow-md transform dark:bg-black">
                          <ul>
                            {/* プロフィールのリンク */}
                            <li>
                              {/* ↓押した時にメニューを閉じたいためボタンにする */}
                              <Popover.Button className="block w-full text-left">
                                <Link href={`/users/`}>
                                  <a className="block py-2 px-4 transition-colors duration-300 hover:bg-gray-200">
                                    <span className="block">{session?.user?.name}</span>
                                    <span className="block text-xs text-gray-400">
                                      @{myUserInfoData?.myUserInfo?.oauthUserId}
                                    </span>
                                  </a>
                                </Link>
                              </Popover.Button>
                            </li>
                            {/* メニューを表示 */}
                            {PROFILE_MENU_ITEMS.map((item) => {
                              return (
                                <li key={item.href}>
                                  <Popover.Button className="block w-full text-left">
                                    <Link href={item.href}>
                                      <a className="block py-2 px-4 border-t transition-colors duration-300 hover:bg-gray-200">
                                        {item.label}
                                      </a>
                                    </Link>
                                  </Popover.Button>
                                </li>
                              );
                            })}
                            {/* サインアウト用 */}
                            <li>
                              <button
                                onClick={handleSignOut}
                                className="block py-2 px-4 w-full text-left border-t transition-colors duration-300 hover:bg-gray-200"
                              >
                                サインアウト
                              </button>
                            </li>
                          </ul>
                        </Popover.Panel>
                      </div>
                    );
                  }}
                </Popover>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

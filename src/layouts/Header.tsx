import { useReactiveVar } from "@apollo/client";
import { Popover } from "@headlessui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { memo, useCallback } from "react";
import { HEADER_MENUS } from "src/constants/menus/header";
import { STATIC_ROUTES } from "src/constants/routes";
import { userInfoVar } from "src/global/state";
import { useAuthModal } from "src/hooks/useAuthModal";
import type { VFC } from "react";

export const Header: VFC = () => {
  const { data } = useSession();
  const userInfo = useReactiveVar(userInfoVar);
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
          {/* ローディング時の場合 */}
          {userInfo.isLoading && (
            <div className="ml-2 w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          )}
          {/* ログイン状態によって変更 */}
          {/* ログイン時の場合 */}
          {!userInfo.isLoading && userInfo.isAuthenticated && (
            <li className="ml-2">
              <div className="top-16 mx-auto w-full">
                <Popover className="relative">
                  {({ open: isOpen }) => {
                    return (
                      <div>
                        <Popover.Button
                          className={`ring-blue-300 overflow-hidden rounded-full h-10 w-10 block active:ring hover:shadow-lg ${
                            isOpen && "ring"
                          }`}
                        >
                          <img
                            src={data?.user?.image ?? ""}
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
                                <Link href={`/users/${userInfo.userId}`}>
                                  <a className="block py-2 px-4 transition-colors duration-300 hover:bg-gray-200">
                                    <span className="block">sample username</span>
                                    <span className="block text-xs text-gray-400">
                                      @{userInfo.userId}
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
          {/* 非ログイン時の場合 */}
          {!userInfo.isLoading && !userInfo.isAuthenticated && (
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
        </ul>
      </nav>
    </header>
  );
};

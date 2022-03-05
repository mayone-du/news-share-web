import type { VFC } from "react";
import Link from "next/link";
import { SIDEBAR_LEFT_MENUS } from "src/constants/menus";
import { useRouter } from "next/router";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import { PostSlackButton } from "src/components/common/PostSlackButton";

export const SidebarLeft: VFC = () => {
  const { asPath } = useRouter();
  const { handleOpenCreateNewsModal } = useCreateNewsModal();

  return (
    <aside>
      <nav>
        <ul>
          {SIDEBAR_LEFT_MENUS.map((menu) => {
            return (
              <li
                key={menu.href}
                className={`rounded overflow-hidden mb-2 hover:bg-gray-100 dark:bg-zinc-700 transition-all ${
                  asPath === menu.href ? "bg-gray-100 dark:bg-zinc-600" : ""
                }`}
              >
                <Link href={menu.href}>
                  <a className="flex items-center py-1 px-2 text-gray-900 lg:py-2 lg:px-4 dark:text-gray-50">
                    <menu.Icon className="block w-6 h-6 text-gray-500 lg:mr-2" />
                    <span className="hidden lg:inline">{menu.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          className="block py-2 px-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow dark:bg-zinc-700 dark:hover:bg-zinc-600"
          onClick={handleOpenCreateNewsModal}
        >
          ニュース・記事を投稿する
        </button>
        <PostSlackButton />
      </nav>
    </aside>
  );
};

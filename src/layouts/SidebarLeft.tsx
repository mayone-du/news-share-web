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
                className={`rounded overflow-hidden mb-2 hover:bg-gray-100 transition-all ${
                  asPath === menu.href ? "bg-gray-100" : ""
                }`}
              >
                <Link href={menu.href}>
                  <a className="flex items-center lg:py-2 py-1 lg:px-4 px-2 text-gray-900">
                    <menu.Icon className="block lg:mr-2 w-6 h-6 text-gray-500" />
                    <span className="lg:inline hidden">{menu.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          className="block py-2 px-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow"
          onClick={handleOpenCreateNewsModal}
        >
          ニュース・記事を投稿する
        </button>
        <PostSlackButton />
      </nav>
    </aside>
  );
};

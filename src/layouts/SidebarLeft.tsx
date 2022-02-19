import type { VFC } from "react";
import Link from "next/link";
import { SIDEBAR_LEFT_MENUS } from "src/constants/menus/sidebarLeft";
import { useRouter } from "next/router";

export const SidebarLeft: VFC = () => {
  const { asPath } = useRouter();
  return (
    <aside>
      <nav>
        <ul>
          {SIDEBAR_LEFT_MENUS.map((menu) => {
            return (
              <li
                key={menu.href}
                className={`border rounded overflow-hidden mb-2 hover:shadow-sm transition-shadow ${
                  asPath === menu.href && "bg-orange-200"
                }`}
              >
                <Link href={menu.href}>
                  <a className="block py-2 px-4">{menu.label}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

import Link from "next/link";
import { memo } from "react";
import type { VFC } from "react";
import { FOOTER_MENUS } from "src/constants";

export const Footer: VFC = memo(() => {
  return (
    <footer>
      <nav className="bg-gray-400">
        <ul className="flex">
          {FOOTER_MENUS.map((menu) => {
            return (
              <li key={menu.href}>
                <Link href={menu.href}>
                  <a className="block p-2 m-2 border">{menu.href}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <p className="py-6 text-center bg-gray-800">copyright&copy;</p>
    </footer>
  );
});

Footer.displayName = "Footer";

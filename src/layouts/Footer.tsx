import Link from "next/link";
import { memo } from "react";
import type { VFC } from "react";
import { FOOTER_MENUS } from "src/constants";

export const Footer: VFC = memo(() => {
  return (
    <footer className="mt-20">
      <nav className="px-64 bg-gray-100">
        <ul className="flex items-center gap-4 py-4">
          {FOOTER_MENUS.map((menu) => {
            return (
              <li key={menu.href}>
                <Link href={menu.href}>
                  <a className="block underline hover:no-underline">{menu.label}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <p className="py-6 text-center text-white bg-gray-800">copyright&copy;</p>
    </footer>
  );
});

Footer.displayName = "Footer";

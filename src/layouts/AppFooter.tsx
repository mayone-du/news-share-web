import Link from "next/link";
import { memo } from "react";
import type { VFC } from "react";
import { FOOTER_MENUS } from "src/constants";
import { Footer, Text } from "@mantine/core";

export const AppFooter: VFC = memo(() => {
  return (
    <Footer height={"auto"} p="xl">
      <Text align="center">copyright&copy;</Text>
      {/* <nav className="px-64 bg-gray-100">
        <ul className="flex gap-4 items-center py-4">
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
      <p className="py-6 text-center text-white bg-gray-800">copyright&copy;</p> */}
    </Footer>
  );
});

Footer.displayName = "Footer";

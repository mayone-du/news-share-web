import type { Action } from "kbar";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { STATIC_ROUTES } from "src/constants/routes";

export const useKBarActions = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const handleToggleTheme = useCallback(() => {
    if (theme === "light") return setTheme("dark");
    if (theme === "dark") return setTheme("light");
    setTheme("dark");
  }, [theme, setTheme]);

  const actions: Action[] = [
    {
      id: "index",
      name: "Back HOME",
      shortcut: ["h"],
      keywords: "back home",
      perform: () => router.push(STATIC_ROUTES.INDEX),
    },
    {
      id: "theme change",
      name: "Change Theme",
      shortcut: ["t"],
      keywords: "theme toggle change",
      perform: () => setTheme("dark"),
    },
    {
      id: "contact",
      name: "Contact",
      shortcut: ["c"],
      keywords: "email",
      perform: () => router.push(STATIC_ROUTES.CONTACT),
    },
    {
      id: "slack",
      name: "Slack Post NewsList",
      shortcut: ["s"],
      keywords: "slack post newsList",
      perform: () => alert("developing..."),
    },
  ];

  return {
    actions,
  };
};

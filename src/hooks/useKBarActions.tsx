import type { Action } from "kbar";
import { useRouter } from "next/router";
import { STATIC_ROUTES } from "src/constants/routes";

export const useKBarActions = () => {
  const { push } = useRouter();

  const actions: Action[] = [
    {
      id: "index",
      name: "Back HOME",
      shortcut: ["h"],
      keywords: "back home",
      perform: () => push(STATIC_ROUTES.INDEX),
    },
    {
      id: "theme change",
      name: "Change Theme",
      shortcut: ["t"],
      keywords: "theme toggle change",
      perform: () => {
        // useThemeが使えないため、自力で更新
        // TODO: Headless UIのみ更新されない
        const currentTheme = localStorage.getItem("theme");
        const htmlTag = document.querySelector("html");
        if (!htmlTag) throw Error("html tag not found");
        htmlTag.style.colorScheme = currentTheme === "dark" ? "light" : "dark";
        htmlTag.className = currentTheme === "dark" ? "dark" : "light";
        localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");
      },
    },
    {
      id: "contact",
      name: "Contact",
      shortcut: ["c"],
      keywords: "email",
      perform: () => push(STATIC_ROUTES.CONTACT),
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

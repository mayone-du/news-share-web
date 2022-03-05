import type { Action } from "kbar";
import { useRouter } from "next/router";
import { STATIC_ROUTES } from "src/constants/routes";

export const useKBarActions = () => {
  const { push } = useRouter();

  const actions: Action[] = [
    {
      id: "index",
      name: "トップに戻る",
      shortcut: ["h"],
      keywords: "back home top",
      perform: () => push(STATIC_ROUTES.INDEX),
    },
    {
      id: "theme change",
      name: "テーマ変更",
      shortcut: ["t"],
      keywords: "theme toggle change dark light",
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
      name: "バグの報告・機能リクエスト",
      shortcut: ["c"],
      keywords: "contact form bug request",
      perform: () => push(STATIC_ROUTES.CONTACT),
    },
    {
      id: "slack",
      name: "Slack Post NewsList [develop]",
      shortcut: ["s"],
      keywords: "slack post newsList",
      perform: () => alert("developing..."),
    },
  ];

  return {
    actions,
  };
};

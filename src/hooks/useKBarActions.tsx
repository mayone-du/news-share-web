import type { Action } from "kbar";
import { useRouter } from "next/router";
import { STATIC_ROUTES } from "src/constants/routes";

export const useKBarActions = () => {
  const router = useRouter();
  const actions: Action[] = [
    {
      id: "index",
      name: "Back HOME",
      shortcut: ["h"],
      keywords: "back home",
      perform: () => router.push(STATIC_ROUTES.INDEX),
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

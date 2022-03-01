import { STATIC_ROUTES } from "src/constants/routes";
import { News } from "src/graphql/schemas/generated/schema";
import { SearchFieldValues } from "src/layouts/SidebarRight/SearchFormCard";

// TODO: 構造化されてるものができてない
export const ROUTE_LABELS: Record<keyof typeof STATIC_ROUTES | 404, string> = {
  INDEX: "トップページ",
  CONTACT: "お問い合わせ",
  ABOUT: "このアプリについて",
  // CONTRIBUTOR: "投稿者 ?",
  EVENT: "QinTV",
  TERM: "利用規約",
  PRIVACY_POLICY: "プライバシーポリシー",
  "404": "ページが見つかりません",
} as const;

export const SEARCH_LABELS: Record<"title" | "description" | "url", string> = {
  title: "タイトル",
  description: "説明",
  url: "URL",
} as const;

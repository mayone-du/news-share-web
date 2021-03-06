import { STATIC_ROUTES } from "src/constants/routes";
import { QueryParams } from "src/types";

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

export const QUERY_PARAM_LABELS: Record<keyof QueryParams, string> = {
  url: "URL",
  title: "タイトル",
  description: "説明",
  sharedAt: "日付",
} as const;

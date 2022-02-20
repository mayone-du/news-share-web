import { STATIC_ROUTES } from "src/constants/routes";

// TODO: 構造化されてるものができてない
export const ROUTE_LABELS: Record<keyof typeof STATIC_ROUTES | 404, string> = {
  INDEX: "トップページ",
  CONTACT: "お問い合わせ",
  ABOUT: "このアプリについて",
  ARCHIVE: "アーカイブ",
  TERM: "利用規約",
  PRIVACY_POLICY: "プライバシーポリシー",
  SAMPLE: "サンプル",
  "404": "ページが見つかりません",
} as const;

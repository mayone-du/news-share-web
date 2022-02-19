import { ROUTE_LABELS } from "src/constants/labels";
import { STATIC_ROUTES } from "src/constants/routes";

// export const SIDEBAR_LEFT_MENUS: Partial<Record<keyof typeof STATIC_ROUTES, string>>[] = [{}] as const;

export const SIDEBAR_LEFT_MENUS = [
  {
    href: STATIC_ROUTES.INDEX,
    label: ROUTE_LABELS["INDEX"],
  },
  {
    href: STATIC_ROUTES.ARCHIVE,
    label: ROUTE_LABELS["ARCHIVE"],
  },
] as const;

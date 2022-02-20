import { ROUTE_LABELS } from "src/constants/labels";
import { STATIC_ROUTES } from "src/constants/routes";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineArchive } from "react-icons/hi";
import { FiMonitor } from "react-icons/fi";
import { IconType } from "react-icons";

export const SIDEBAR_LEFT_MENUS: {
  href: typeof STATIC_ROUTES[keyof typeof STATIC_ROUTES]; // STATIC_ROUTESの値
  label: typeof ROUTE_LABELS[keyof typeof ROUTE_LABELS]; // ROUTE_LABELSの値
  Icon: IconType;
}[] = [
  {
    href: STATIC_ROUTES.INDEX,
    label: ROUTE_LABELS.INDEX,
    Icon: AiOutlineHome,
  },
  {
    href: STATIC_ROUTES.ARCHIVE,
    label: ROUTE_LABELS.ARCHIVE,
    Icon: HiOutlineArchive,
  },
  {
    href: STATIC_ROUTES.EVENT,
    label: ROUTE_LABELS.EVENT,
    Icon: FiMonitor,
  },
];

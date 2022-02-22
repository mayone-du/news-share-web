import type { VFC } from "react";
import Link from "next/link";
import { SIDEBAR_LEFT_MENUS } from "src/constants/menus";
import { useRouter } from "next/router";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import {
  Role,
  useMyUserInfoQuery,
  useCreateSlackNotificationMutation,
} from "src/graphql/schemas/generated/schema";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";

export const SidebarLeft: VFC = () => {
  const { asPath } = useRouter();
  const { handleOpenCreateNewsModal } = useCreateNewsModal();
  const { data } = useMyUserInfoQuery({ fetchPolicy: "cache-only" });
  const [createSlackNotification, { loading }] = useCreateSlackNotificationMutation();
  const handleCreateSlackNotification = async () => {
    const toastId = toast.loading("Slack通知を送信しています...");
    try {
      await createSlackNotification();
      toast.success("Slack通知を送信しました", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Slack通知の送信に失敗しました", { id: toastId });
    }
  };

  return (
    <aside>
      <nav>
        <ul>
          {SIDEBAR_LEFT_MENUS.map((menu) => {
            return (
              <li
                key={menu.href}
                className={`rounded overflow-hidden mb-2 hover:bg-gray-100 transition-all ${
                  asPath === menu.href ? "bg-gray-100" : ""
                }`}
              >
                <Link href={menu.href}>
                  <a className="flex items-center py-2 px-4 text-gray-900">
                    <menu.Icon className="block mr-2 w-6 h-6 text-gray-500" />
                    {menu.label}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          className="block py-2 px-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow"
          onClick={handleOpenCreateNewsModal}
        >
          ニュース・記事を投稿する
        </button>
        {data?.myUserInfo?.role === "ADMIN" || data?.myUserInfo?.role === "DEVELOPER" ? (
          <button
            className="flex items-center py-2 px-4 mt-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow"
            onClick={handleCreateSlackNotification}
            disabled={loading}
          >
            Slackへ送信する
            {loading && <CgSpinner className="ml-2 animate-spin" />}
          </button>
        ) : null}
      </nav>
    </aside>
  );
};

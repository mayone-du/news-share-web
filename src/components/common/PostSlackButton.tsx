import { useCallback, useState } from "react";
import type { VFC } from "react";
import {
  Role,
  useMyUserInfoQuery,
  useCreateSlackNotificationMutation,
  useSlackNotificationQuery,
  useNewsListQuery,
  usePostponeNewsListMutation,
} from "src/graphql/schemas/generated/schema";
import toast from "react-hot-toast";
import { hyphenFormat } from "src/utils";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { FiSend } from "react-icons/fi";
import { Modal, Title } from "@mantine/core";

export const PostSlackButton: VFC = () => {
  const { asPath } = useRouter();
  if (asPath !== "/") return null;
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" });
  const { data: newsListData } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
    fetchPolicy: "cache-only",
    nextFetchPolicy: "network-only",
  });
  const { data: slackNotificationData, loading: isSlackNotificationLoading } =
    useSlackNotificationQuery();
  const [
    createSlackNotification,
    { error: createSalckNotificationError, loading: isCreateSlackNotificationLoading },
  ] = useCreateSlackNotificationMutation();
  const [postponeNewsList, { error: postponeNewsListError, loading: isPostponeNewsListLoading }] =
    usePostponeNewsListMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseDialog = useCallback(() => setIsOpenModal(false), []);
  const handleOpenDialog = useCallback(() => setIsOpenModal(true), []);
  const handleEndNewsShare = async () => {
    // シェアしていないもの(見ていないもの)は延期する
    const willPostponeNewsIds = (newsListData?.newsList
      .map((news) => (news.isViewed ? null : news.nodeId))
      .filter(Boolean) ?? []) as string[]; // filterでfalsyな値を削除しているため
    const toastId = toast.loading(
      willPostponeNewsIds?.length
        ? "Slackへ送信とニュースの延期をしています..."
        : "Slackへ送信しています...",
    );
    // 延期するニュースがある場合
    if (willPostponeNewsIds?.length) {
      try {
        await createSlackNotification();
        await postponeNewsList({
          variables: {
            input: {
              nodeIds: willPostponeNewsIds,
              sharedAt: dayjs().add(1, "day").format(hyphenFormat),
            },
          },
        });
        toast.success("ニュースの延期とSlackへ送信が完了しました", { id: toastId });
      } catch (e) {
        console.error(e);
        if (createSalckNotificationError)
          return toast.error("Slack通知とニュースの延期に失敗しました", { id: toastId });
        toast.error("ニュースの延期に失敗しました", { id: toastId });
      }
    } else {
      try {
        await createSlackNotification();
      } catch (e) {
        console.error(e);
        toast.error("Slack通知の送信に失敗しました", { id: toastId });
      }
    }
    handleCloseDialog();
  };

  if (!myUserInfoData?.myUserInfo) return null;

  return (
    <div>
      {myUserInfoData?.myUserInfo?.role !== Role.User && (
        <div>
          <button
            className="flex gap-3 items-center py-2 px-4 mt-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:bg-gray-300"
            onClick={handleOpenDialog}
          >
            <FiSend className="w-5 h-5 text-gray-500" />
            Slackへ送信する
          </button>
          <Modal
            opened={isOpenModal}
            onClose={handleCloseDialog}
            title={
              <Title order={3} className="text-xl font-bold text-center text-gray-900">
                今日のニュースシェアを終了する
              </Title>
            }
          >
            <div className="flex justify-center items-center px-4 min-h-screen">
              <div className="overflow-hidden p-8 m-auto w-80 bg-white rounded-lg shadow-xl transition-all transform sm:w-96">
                <ul className="flex flex-col gap-1 px-4 mt-4 list-disc text-gray-600">
                  <li>既にシェアしたニュースをSlackへ送信</li>
                  <li>シェアしていないニュースを明日へ延期</li>
                </ul>
                <p className="mt-2 text-sm text-gray-500">以上の2つを行います</p>

                {slackNotificationData?.slackNotification?.isSent && (
                  <p className="mt-6 text-sm text-red-500">
                    今日はすでにSlackに送信しているようです。本当にもう一度送信しますか？
                  </p>
                )}

                {/* TODO: プレビュー表示？ */}
                {/* {newsListData?.newsList.map((news) => {
                      return (
                        <div key={news.nodeId} className="text-sm text-gray-600 line-clamp-1">
                          {news.title}
                        </div>
                      );
                    })} */}

                <div className="mt-6">
                  <button
                    type="button"
                    className="flex items-center py-2 px-6 mx-auto bg-gray-50 rounded border border-gray-200 ring-blue-200 shadow transition-all outline-none hover:bg-gray-100 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-300 active:ring-2"
                    onClick={handleEndNewsShare}
                    disabled={
                      isSlackNotificationLoading ||
                      isCreateSlackNotificationLoading ||
                      isPostponeNewsListLoading
                    }
                  >
                    実行する
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

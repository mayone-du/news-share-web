import { useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { VFC } from "react";
import {
  Role,
  useMyUserInfoQuery,
  useCreateSlackNotificationMutation,
  useSlackNotificationQuery,
  useNewsListQuery,
  usePostponeNewsListMutation,
} from "src/graphql/schemas/generated/schema";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import { hyphenFormat } from "src/utils";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export const PostSlackButton: VFC = () => {
  const { asPath } = useRouter();
  if (asPath !== "/") return null;
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" });
  const { data: newsListData } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
    fetchPolicy: "cache-only",
  });
  const { data: slackNotificationData, loading: isSlackNotificationLoading } =
    useSlackNotificationQuery();
  const [createSlackNotification, { loading: isCreateSlackNotificationLoading }] =
    useCreateSlackNotificationMutation();
  const [postponeNewsList, { loading: isPostponeNewsListLoading }] = usePostponeNewsListMutation();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const handleCloseDialog = useCallback(() => setIsOpenDialog(false), []);
  const handleOpenDialog = useCallback(() => setIsOpenDialog(true), []);
  const handleEndNewsShare = async () => {
    const willPostponeNewsIds = newsListData?.newsList
      .filter((news) => !news.isViewed)
      .map((news) => news.id);
    const toastId = toast.loading(
      willPostponeNewsIds?.length
        ? "Slackへ送信とニュースの延期をしています..."
        : "Slackへ送信しています...",
    );
    try {
      await createSlackNotification();
    } catch (e) {
      console.error(e);
      toast.error("Slack通知の送信に失敗しました", { id: toastId });
    }
  };

  if (!myUserInfoData?.myUserInfo) return null;

  return (
    <div>
      {myUserInfoData?.myUserInfo?.role !== Role.User && (
        <div>
          <button
            className="flex items-center py-2 px-4 mt-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:bg-gray-300"
            onClick={handleOpenDialog}
          >
            Slackへ送信する
          </button>
          <Transition appear show={isOpenDialog} as="div">
            <Dialog
              as="div"
              className="overflow-y-auto fixed inset-0 z-10 bg-gray-400 bg-opacity-40"
              onClose={handleCloseDialog}
            >
              <div className="flex justify-center items-center px-4 min-h-screen">
                <Transition.Child
                  as="div"
                  enter="ease-out duration-50"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-50"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                <span className="inline-block h-screen align-middle" aria-hidden="true">
                  &#8203;
                </span>
                <Transition.Child
                  as="div"
                  enter="ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-50"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="overflow-hidden p-8 m-auto w-80 bg-white rounded-lg shadow-xl transition-all transform sm:w-96">
                    <Dialog.Title as="h3" className="text-3xl font-bold text-center text-gray-900">
                      Qinニュースシェア
                    </Dialog.Title>

                    {slackNotificationData?.slackNotification?.isSent && (
                      <p className="mt-6 text-sm text-red-500">
                        今日はすでにSlackに送信しているようです。本当にもう一度送信しますか？
                      </p>
                    )}

                    {/* TODO: プレビュー表示？ */}
                    {/* {newsListData?.newsList.map((news) => {
                      return (
                        <div key={news.nodeId} className="text-gray-600 text-sm line-clamp-1">
                          {news.title}
                        </div>
                      );
                    })} */}

                    <div className="my-6">
                      <button
                        type="button"
                        className="flex items-center py-2 px-6 mx-auto bg-gray-50 rounded border border-gray-200 ring-blue-200 shadow transition-all outline-none hover:bg-gray-100 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-300 active:ring-2"
                        onClick={handleEndNewsShare}
                        disabled={isSlackNotificationLoading || isCreateSlackNotificationLoading}
                      >
                        実行する
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>
      )}
    </div>
  );
};

// {myUserInfoData?.myUserInfo?.role === Role.Admin ||
// myUserInfoData?.myUserInfo?.role === Role.Developer ? (
//   <button
//     className="flex items-center py-2 px-4 mt-4 rounded border shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:bg-gray-300"
//     onClick={handleCreateSlackNotification}
//     disabled={loading || slackNotificationData?.slackNotification?.isSent}
//   >
//     Slackへ送信する
//     {loading && <CgSpinner className="ml-2 animate-spin" />}
//   </button>
// ) : null}

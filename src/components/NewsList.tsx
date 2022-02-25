import { SyntheticEvent, useState, VFC } from "react";
import {
  News,
  Role,
  useDeleteNewsMutation,
  useMyUserInfoQuery,
  useUpdateNewsMutation,
  useToggleLikeMutation,
} from "src/graphql/schemas/generated/schema";
import type { NewsListQueryResult } from "src/graphql/schemas/generated/schema";
import { calcFromNow, hyphenFormat, isStartedNewsShare } from "src/utils";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Popover } from "@headlessui/react";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsCalendarCheck, BsCheck, BsCheck2 } from "react-icons/bs";
import { IoMdReturnLeft } from "react-icons/io";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import dayjs from "dayjs";

type FieldValues = {
  title: string;
  description: string;
};

type Props = {
  newsListQueryResult: NewsListQueryResult;
};

export const NewsList: VFC<Props> = (props) => {
  const {
    newsListQueryResult: { data: NewsListData, loading, error, refetch },
  } = props;
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" }); // layoutで取得してるのでcache-onlyでネットワークリクエストを抑える
  const [updateNews, { loading: isUpdateNewsLoading }] = useUpdateNewsMutation();
  const [deleteNews, { loading: isDeleteNewsLoading }] = useDeleteNewsMutation();
  const [toggleLike, { loading: isToggleLikeLoading }] = useToggleLikeMutation();
  const { register, setValue, handleSubmit } = useForm<FieldValues>();
  const [editingNewsNodeId, setEditingNewsNodeId] = useState("");
  const isEditingNewsId = (newsId?: string | null) => newsId === editingNewsNodeId;
  const isDisplayNewsMenu = (userId: bigint) =>
    myUserInfoData?.myUserInfo?.role === Role.Admin ||
    myUserInfoData?.myUserInfo?.role === Role.Developer ||
    myUserInfoData?.myUserInfo?.id === userId;
  const isLikedNews = (news: Pick<News, "likes">) =>
    news.likes.some((like) => like.user.id === myUserInfoData?.myUserInfo?.id && like.isLiked);
  const isTodaySharedAt = (sharedAt: string) =>
    dayjs(sharedAt).format(hyphenFormat) === dayjs().format(hyphenFormat);

  const handleClickNewsEditMode =
    (news: Pick<News, "nodeId" | "title" | "description">, handleClosePopover: VoidFunction) =>
    () => {
      setEditingNewsNodeId(news.nodeId ?? "");
      setValue("title", news.title);
      setValue("description", news.description);
      handleClosePopover();
    };
  const handleClickNewsEditCancel = () => setEditingNewsNodeId("");
  const handleDeleteNews =
    (nodeId: string | null | undefined, handleClosePopover: VoidFunction) => async () => {
      if (!nodeId) return; // TODO: throw する？
      const toastId = toast.loading("ニュースを削除しています...");
      try {
        handleClosePopover();
        await deleteNews({ variables: { input: { nodeId } } });
        await refetch();
        toast.success("ニュースを削除しました", { id: toastId });
      } catch (e) {
        console.error(e);
        toast.error("ニュースの削除に失敗しました", { id: toastId });
      }
    };
  const handleUpdateNews = async (values: FieldValues) => {
    const toastId = toast.loading("ニュースを更新しています...");
    try {
      await updateNews({ variables: { input: { nodeId: editingNewsNodeId, ...values } } });
      setEditingNewsNodeId("");
      toast.success("ニュースを更新しました", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("ニュースの更新に失敗しました", { id: toastId });
    }
  };
  const handlePostponeNews =
    (nodeId: string | null | undefined, handleClosePopover: VoidFunction) => async () => {
      if (!nodeId) return; // TODO: throw する？
      const toastId = toast.loading("ニュースを延期しています...");
      try {
        handleClosePopover();
        await updateNews({
          variables: { input: { nodeId, sharedAt: dayjs().add(1, "day").format(hyphenFormat) } },
        });
        await refetch();
        toast.success("ニュースを延期しました", { id: toastId });
      } catch (e) {
        console.error(e);
        toast.error("ニュースの延期に失敗しました", { id: toastId });
      }
    };
  const handleUpdateViewedNews =
    (news: Pick<News, "nodeId" | "isViewed">) => async (e: SyntheticEvent) => {
      if (!news.nodeId) return; // TODO: throw する？
      if (isEditingNewsId(news.nodeId)) return e.preventDefault(); // 編集中の場合はリンクの機能を持たせない
      if (
        news.isViewed ||
        !isStartedNewsShare(dayjs()) ||
        myUserInfoData?.myUserInfo?.role === Role.User
      )
        return; // すでに閲覧済み、ニュースシェアが始まっていない、一般ユーザーの場合は何もしない
      try {
        await updateNews({ variables: { input: { nodeId: news.nodeId, isViewed: true } } });
      } catch (e) {
        console.error(e);
      }
    };
  const handleToggleViewedNews =
    (news: Pick<News, "nodeId" | "isViewed">, handleClosePopover: VoidFunction) => async () => {
      if (!news.nodeId) return; // TODO: throw する？
      try {
        handleClosePopover();
        await updateNews({
          variables: { input: { nodeId: news.nodeId, isViewed: !news.isViewed } },
        });
      } catch (e) {
        console.error(e);
      }
    };
  const handleToggleLike = (newsId: bigint, isLiked: boolean) => async () => {
    try {
      await toggleLike({ variables: { input: { newsId, isLiked } } });
      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div>
        <CgSpinner className="animate-spin" />
      </div>
    );
  if (error)
    return (
      <div>
        <p className="text-red-500">ニュースの取得に失敗しました</p>
      </div>
    );
  if (NewsListData?.newsList.length === 0) return <div>ニュースはまだありません</div>;

  return (
    <ul>
      {NewsListData?.newsList.map((news) => {
        return (
          <li
            key={news.nodeId}
            className={`relative mb-4 rounded border ${
              isEditingNewsId(news.nodeId) ? "ring-2 ring-blue-200" : ""
            }`}
          >
            {/* UI的にはリンクの中だけど、要素的にはリンクの外に配置したい */}
            {/* 管理者か自分の投稿したニュースであれば、ニュースに対してのメニュー表示 */}
            {isDisplayNewsMenu(news.user.id) && (
              <Popover>
                {({ open, close }) => {
                  return (
                    <div>
                      <Popover.Button
                        className={`items-center absolute top-2 right-2 justify-center p-1 rounded-full flex hover:bg-gray-200 border border-transparent hover:border-gray-50 ${
                          open && "bg-gray-200"
                        } ${isEditingNewsId(news.nodeId) && "hidden"}`}
                      >
                        <BiChevronDown className="w-6 h-6 text-gray-600" />
                      </Popover.Button>
                      <Popover.Panel className="absolute -right-4 top-10 z-10 mt-4 w-72 bg-white rounded border shadow-md transform dark:bg-black">
                        <ul>
                          {/* 今日シェアする予定のニュース以外は延期できない */}
                          {isTodaySharedAt(news.sharedAt) && (
                            <li>
                              <button
                                className="flex items-center p-2 w-full text-gray-600 border-b hover:bg-gray-100"
                                onClick={handlePostponeNews(news.nodeId, close)}
                                disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                              >
                                <BsCalendarCheck className="mr-4 w-5 h-5 text-gray-500" />
                                明日に延期する
                              </button>
                            </li>
                          )}
                          <li>
                            <button
                              className="flex items-center p-2 w-full text-gray-600 border-b hover:bg-gray-100"
                              onClick={handleToggleViewedNews(news, close)}
                              disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                            >
                              {news.isViewed ? (
                                <IoMdReturnLeft className="mr-4 w-5 h-5 text-gray-500" />
                              ) : (
                                <BsCheck2 className="mr-4 w-5 h-5 text-gray-500" />
                              )}
                              {news.isViewed ? "シェアしていない状態に戻す" : "シェア済みにする"}
                            </button>
                          </li>
                          <li>
                            <button
                              className="flex items-center p-2 w-full text-gray-600 hover:bg-gray-100"
                              onClick={handleClickNewsEditMode(news, close)}
                              disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                            >
                              <HiOutlinePencil className="mr-4 w-5 h-5 text-gray-500" />
                              編集する
                            </button>
                          </li>
                          <li>
                            <button
                              className="flex items-center p-2 w-full text-red-500 hover:bg-gray-100 disabled:bg-gray-200"
                              onClick={handleDeleteNews(news.nodeId, close)}
                              disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                            >
                              <RiDeleteBinLine className="mr-4 w-5 h-5 text-red-400" />
                              削除する
                            </button>
                          </li>
                        </ul>
                      </Popover.Panel>
                    </div>
                  );
                }}
              </Popover>
            )}

            {/* TODO: newsの型 最悪 as を使う */}
            {/* TODO: いいねしたときのanimation */}
            <button
              onClick={handleToggleLike(news.id, !isLikedNews(news))}
              className="block absolute bottom-3 left-60 text-xs text-gray-400 outline-none"
            >
              {isLikedNews(news) ? (
                <FaHeart className="w-6 h-6 text-red-500" />
              ) : (
                <FiHeart className="w-6 h-6" />
              )}
            </button>

            {news.isViewed && <BsCheck className="absolute left-1 top-3 w-6 h-6 text-green-400" />}

            {/* コンテンツ */}
            <a
              href={news.url}
              className={`block py-3 px-8 hover:bg-gray-50 ${
                isEditingNewsId(news.nodeId) ? "hover:bg-white cursor-default" : ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleUpdateViewedNews(news)}
            >
              <div>
                {isEditingNewsId(news.nodeId) ? (
                  <input
                    className="block mb-2 w-full text-lg font-bold outline-none"
                    placeholder="ニュースのタイトル"
                    {...register("title")}
                  />
                ) : (
                  <h3 className="mb-2 text-lg font-bold line-clamp-1">{news.title || news.url}</h3>
                )}

                <div className="flex justify-between">
                  {isEditingNewsId(news.nodeId) ? (
                    <textarea
                      className="mr-4 mb-2 w-full text-sm text-gray-400 outline-none resize-none"
                      placeholder="ニュースの説明"
                      {...register("description")}
                    />
                  ) : (
                    <p className="mr-4 mb-2 text-sm text-gray-400 line-clamp-2">
                      {news.description}
                    </p>
                  )}
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title || news.description || news.url}
                      className="block object-cover w-16 h-16 rounded-md border border-gray-100"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="flex items-center">
                  {news.user.photoUrl ? (
                    <img
                      src={news.user.photoUrl}
                      alt={news.user.displayName}
                      className="mr-1 w-6 h-6 rounded-full border border-gray-100"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="mr-4 text-sm font-bold text-gray-600">
                    {news.user.displayName}
                  </span>
                  <span className="flex items-center mr-4 text-xs text-gray-400">
                    <AiOutlineClockCircle className="mr-1 w-4 h-4" />
                    {calcFromNow(news.createdAt)}
                  </span>
                </div>
              </div>
            </a>
            {/* 編集中の場合に更新、キャンセルボタンを表示 */}
            {isEditingNewsId(news.nodeId) && (
              <div className="flex gap-4 justify-end items-center px-4 pb-4 w-full">
                <button
                  className="block py-1 px-2 bg-gray-50 rounded border"
                  onClick={handleSubmit(handleUpdateNews)}
                  disabled={isUpdateNewsLoading}
                >
                  更新する
                </button>
                <button
                  className="block py-1 px-2 bg-gray-50 rounded border"
                  onClick={handleClickNewsEditCancel}
                >
                  キャンセル
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

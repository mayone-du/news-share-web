import { SyntheticEvent, useState, VFC } from "react";
import {
  News,
  Role,
  useDeleteNewsMutation,
  useMyUserInfoQuery,
  useUpdateNewsMutation,
  useToggleLikeMutation,
  UpdateNewsMutationVariables,
} from "src/graphql/schemas/generated/schema";
import type { NewsListQueryResult } from "src/graphql/schemas/generated/schema";
import { calcFromNow, hyphenFormat, isStartedNewsShare } from "src/utils";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Popover } from "@headlessui/react";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsCalendar, BsCheck, BsCheck2 } from "react-icons/bs";
import { IoMdReturnLeft } from "react-icons/io";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FiHeart } from "react-icons/fi";
import { IoEarth } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { InvalidIdError } from "src/errors";
import { Tooltip } from "src/components/common/Tooltip";
import { Reference } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useAuthModal } from "src/hooks/useAuthModal";

// TODO: NonNullableを適用したい。まだ型安全ではない
type FieldValues = Required<
  Pick<UpdateNewsMutationVariables["input"], "title" | "description" | "url">
>;

type Props = {
  newsListQueryResult: NewsListQueryResult;
};

export const NewsList: VFC<Props> = (props) => {
  const { asPath } = useRouter();
  const { status } = useSession();
  const { handleToggleAuthModal } = useAuthModal();
  const {
    newsListQueryResult: { data: NewsListData, loading, error, refetch },
  } = props;
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" }); // layoutで取得してるのでcache-onlyでネットワークリクエストを抑える
  const [updateNews, { loading: isUpdateNewsLoading }] = useUpdateNewsMutation();
  const [deleteNews, { loading: isDeleteNewsLoading }] = useDeleteNewsMutation();
  const [toggleLike, { loading: isToggleLikeLoading }] = useToggleLikeMutation();
  const { register, setValue, handleSubmit } = useForm<FieldValues>();
  const [editingNewsNodeId, setEditingNewsNodeId] = useState("");
  const isEditingNewsId = (news: Pick<News, "nodeId">) => news.nodeId === editingNewsNodeId;
  const isDisplayNewsMenu = (userId: bigint) =>
    myUserInfoData?.myUserInfo?.role === Role.Admin ||
    myUserInfoData?.myUserInfo?.role === Role.Developer ||
    myUserInfoData?.myUserInfo?.id === userId;
  const isLikedNews = (news: Pick<News, "likes">) =>
    news.likes.some((like) => like.user.id === myUserInfoData?.myUserInfo?.id && like.isLiked);
  const isTodaySharedAt = (sharedAt: string) =>
    dayjs(sharedAt).format(hyphenFormat) === dayjs().format(hyphenFormat);

  const handleClickNewsEditMode =
    (
      news: Pick<News, "nodeId" | "title" | "description" | "url">,
      handleClosePopover: VoidFunction,
    ) =>
    () => {
      setEditingNewsNodeId(news.nodeId ?? "");
      setValue("title", news.title);
      setValue("description", news.description);
      setValue("url", news.url);
      handleClosePopover();
    };
  const handleClickNewsEditCancel = () => setEditingNewsNodeId("");
  const handleDeleteNews =
    (nodeId: string | null | undefined, handleClosePopover: VoidFunction) => async () => {
      if (!nodeId) throw InvalidIdError();
      const toastId = toast.loading("ニュースを削除しています...");
      try {
        handleClosePopover();
        await deleteNews({
          variables: { input: { nodeId } },
          update: (cache, { data }) => {
            if (!data?.deleteNews) return;
            cache.modify({
              fields: {
                newsList: (existingNewsListRefs: Reference[], { readField }) => {
                  return existingNewsListRefs.filter(
                    (newsListRef) => readField("nodeId", newsListRef) !== data.deleteNews?.nodeId,
                  );
                },
              },
            });
          },
        });
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
      if (!nodeId) throw InvalidIdError();
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
      if (!news.nodeId) throw InvalidIdError();
      if (isEditingNewsId(news)) return e.preventDefault(); // 編集中の場合はリンクの機能を持たせない
      if (
        news.isViewed ||
        !isStartedNewsShare(dayjs()) ||
        myUserInfoData?.myUserInfo?.role === Role.User ||
        asPath !== "/"
      )
        return; // すでに閲覧済み、ニュースシェアが始まっていない、一般ユーザー、トップページ以外の場合は何もしない
      try {
        await updateNews({ variables: { input: { nodeId: news.nodeId, isViewed: true } } });
      } catch (e) {
        console.error(e);
      }
    };
  const handleToggleViewedNews =
    (news: Pick<News, "nodeId" | "isViewed">, handleClosePopover: VoidFunction) => async () => {
      if (!news.nodeId) throw InvalidIdError();
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
    if (status === "unauthenticated") return handleToggleAuthModal();
    try {
      await toggleLike({ variables: { input: { newsId, isLiked } } });
      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <ul className="flex flex-col gap-4">
        <li className="border rounded py-3 px-8 w-full">
          <div className="bg-gray-100 animate-pulse h-6 w-3/4 mb-4"></div>
          <div className="bg-gray-100 animate-pluse h-4 mb-1 w-full"></div>
          <div className="bg-gray-100 animate-pluse h-4 mb-4 w-full"></div>
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 rounded-full bg-gray-100 animate-pulse mr-2"></div>
            <div className="bg-gray-100 animate-pluse h-3 w-1/3"></div>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-100 animate-pulse mr-1"></div>
            <div className="bg-gray-100 animate-pulse h-4 w-20"></div>
          </div>
        </li>
      </ul>
    );
  if (error)
    return (
      <div>
        <p className="text-red-500">ニュースの取得に失敗しました</p>
      </div>
    );

  if (NewsListData?.newsList.length === 0)
    return (
      <div>
        <p>ニュースはありません</p>
      </div>
    );

  return (
    <ul>
      {NewsListData?.newsList.map((news) => {
        return (
          <li
            key={news.nodeId}
            className={`relative mb-4 rounded border ${
              isEditingNewsId(news) ? "ring-2 ring-blue-200" : ""
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
                        } ${isEditingNewsId(news) && "hidden"}`}
                      >
                        <BiChevronDown className="w-6 h-6 text-gray-600" />
                      </Popover.Button>
                      <Popover.Panel className="absolute -right-4 top-10 z-10 mt-4 w-72 bg-white rounded border shadow-md transform dark:bg-black">
                        <ul>
                          {/* 今日シェアする予定のニュース以外は延期できない */}
                          {isTodaySharedAt(news.sharedAt) && (
                            <li>
                              <button
                                className="flex items-center p-2 w-full text-gray-600 hover:bg-gray-100"
                                onClick={handlePostponeNews(news.nodeId, close)}
                                disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                              >
                                <BsCalendar className="mr-4 w-5 h-5 text-gray-500" />
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
            <div className="absolute bottom-3 left-60 text-xs text-gray-400 outline-none">
              <Tooltip tooltipText="いいねをすると後でマイページから見返すことができます">
                <button
                  className="block"
                  onClick={handleToggleLike(news.id, !isLikedNews(news as News))}
                  disabled={isUpdateNewsLoading || isDeleteNewsLoading || isToggleLikeLoading}
                >
                  {isLikedNews(news as News) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FiHeart className="w-6 h-6" />
                  )}
                </button>
              </Tooltip>
            </div>

            {news.isViewed && <BsCheck className="absolute left-1 top-3 w-6 h-6 text-green-400" />}

            {/* コンテンツ */}
            <a
              href={news.url}
              className={`block py-3 px-8 rounded hover:bg-gray-50 ${
                isEditingNewsId(news) ? "hover:bg-white cursor-default" : ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleUpdateViewedNews(news)}
            >
              <div>
                {isEditingNewsId(news) ? (
                  <input
                    className="block mb-2 w-full text-lg font-bold outline-none"
                    placeholder="ニュースのタイトル"
                    {...register("title")}
                  />
                ) : (
                  <h3 className="mb-2 text-lg font-bold line-clamp-1">{news.title || news.url}</h3>
                )}

                <div className="grid grid-cols-6 gap-6">
                  {isEditingNewsId(news) ? (
                    <textarea
                      className="col-span-5 mb-2 text-sm text-gray-400 outline-none resize-none"
                      placeholder="ニュースの説明"
                      {...register("description")}
                    />
                  ) : (
                    <div className="col-span-5">
                      <p className="mb-2 text-sm text-gray-400 line-clamp-3">{news.description}</p>
                    </div>
                  )}
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title || news.description || news.url}
                      className="block object-cover col-span-1 rounded-md border border-gray-100 aspect-square"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                {/* urlとfavicon */}
                <p className="flex gap-2 items-center mb-4">
                  {news.faviconUrl ? (
                    <img src={news.faviconUrl} alt={""} className="block w-5 h-5" loading="lazy" />
                  ) : (
                    <IoEarth className="w-5 h-5 text-gray-500" />
                  )}
                  {isEditingNewsId(news) ? (
                    <input
                      className="block flex-1 text-xs text-gray-600 outline-none"
                      type="url"
                      required
                      placeholder="https://news.com/..."
                      {...register("url", { required: true })}
                    />
                  ) : (
                    <span className="block text-xs text-blue-400 underline hover:no-underline">
                      {news.url}
                    </span>
                  )}
                </p>
                {/* 下のサブ情報 */}
                <div className="flex items-center">
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
              </div>
            </a>
            {/* 編集中の場合に更新、キャンセルボタンを表示 */}
            {isEditingNewsId(news) && (
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

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
import { FiChevronDown } from "react-icons/fi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsCalendar, BsCheck, BsCheck2 } from "react-icons/bs";
import { IoMdReturnLeft } from "react-icons/io";
import { useForm } from "@mantine/form";
import { FiHeart } from "react-icons/fi";
import { IoEarth } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { InvalidIdError } from "src/errors";
import { Reference } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useAuthModal } from "src/hooks/useAuthModal";
import {
  TextInput,
  Box,
  Divider,
  Menu,
  UnstyledButton,
  Avatar,
  Tooltip,
  Button,
} from "@mantine/core";
import { genId } from "src/utils/genId";
import { showNotification, updateNotification } from "@mantine/notifications";

// TODO: NonNullableを適用したい。まだ型安全ではない
type FieldValues = {
  url: string;
  title: string;
  description: string;
};

type Props = {
  newsListQueryResult: NewsListQueryResult;
};

export const NewsList: VFC<Props> = (props) => {
  const { asPath } = useRouter();
  const { status } = useSession();
  const { handleOpenAuthModal } = useAuthModal();
  const {
    newsListQueryResult: { data: NewsListData, loading, error, refetch },
  } = props;
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" }); // layoutで取得してるのでcache-onlyでネットワークリクエストを抑える
  const [updateNews, { loading: isUpdateNewsLoading }] = useUpdateNewsMutation();
  const [deleteNews, { loading: isDeleteNewsLoading }] = useDeleteNewsMutation();
  const [toggleLike, { loading: isToggleLikeLoading }] = useToggleLikeMutation();
  const { onSubmit, reset, getInputProps, setValues } = useForm<FieldValues>({
    initialValues: {
      url: "",
      title: "",
      description: "",
    },

    validate: {
      url: (value) => {
        if (!value) return "URLを入力してください";
      },
    },
  });
  const [editingNewsNodeId, setEditingNewsNodeId] = useState("");
  const isEditingNews = (news: Pick<News, "nodeId">) => news.nodeId === editingNewsNodeId;
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
      setValues(news);
      handleClosePopover();
    };
  const handleClickNewsEditCancel = () => setEditingNewsNodeId("");
  const handleDeleteNews =
    (nodeId: string | null | undefined, handleClosePopover: VoidFunction) => async () => {
      if (!nodeId) throw InvalidIdError();
      const notificationId = genId();
      showNotification({
        id: notificationId,
        message: "ニュースを削除しています...",
      });
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
        updateNotification({
          id: notificationId,
          message: "ニュースを削除しました",
        });
      } catch (e) {
        console.error(e);
        updateNotification({
          id: notificationId,
          message: "ニュースを削除に失敗しました",
        });
      }
    };
  const handleUpdateNews = async (values: FieldValues) => {
    const notificationId = genId();
    showNotification({
      id: notificationId,
      message: "ニュースを更新しています...",
    });
    try {
      await updateNews({ variables: { input: { nodeId: editingNewsNodeId, ...values } } });
      setEditingNewsNodeId("");
      updateNotification({
        id: notificationId,
        message: "ニュースを更新しました",
      });
    } catch (e) {
      console.error(e);
      updateNotification({
        id: notificationId,
        message: "ニュースを更新に失敗しました",
      });
    }
  };
  const handlePostponeNews =
    (nodeId: string | null | undefined, handleClosePopover: VoidFunction) => async () => {
      if (!nodeId) throw InvalidIdError();
      const notificationId = genId();
      showNotification({
        id: notificationId,
        message: "ニュースを延期しています...",
      });
      try {
        handleClosePopover();
        await updateNews({
          variables: { input: { nodeId, sharedAt: dayjs().add(1, "day").format(hyphenFormat) } },
        });
        await refetch();
        updateNotification({
          id: notificationId,
          message: "ニュースを延期しました",
        });
      } catch (e) {
        console.error(e);
        updateNotification({
          id: notificationId,
          message: "ニュースの延期に失敗しました",
        });
      }
    };
  const handleUpdateViewedNews =
    (news: Pick<News, "nodeId" | "isViewed">) => async (e: SyntheticEvent) => {
      if (!news.nodeId) throw InvalidIdError();
      if (isEditingNews(news)) return e.preventDefault(); // 編集中の場合はリンクの機能を持たせない
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
  const handleToggleViewedNews = (news: Pick<News, "nodeId" | "isViewed">) => async () => {
    if (!news.nodeId) throw InvalidIdError();
    try {
      await updateNews({
        variables: { input: { nodeId: news.nodeId, isViewed: !news.isViewed } },
      });
    } catch (e) {
      console.error(e);
    }
  };
  const handleToggleLike = (newsId: bigint, isLiked: boolean) => async () => {
    if (status === "unauthenticated") return handleOpenAuthModal();
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
        <li className="py-3 px-8 w-full rounded border">
          <div className="mb-4 w-3/4 h-6 bg-gray-100 animate-pulse"></div>
          <div className="mb-1 w-full h-4 bg-gray-100 animate-pluse"></div>
          <div className="mb-4 w-full h-4 bg-gray-100 animate-pluse"></div>
          <div className="flex items-center mb-4">
            <div className="mr-2 w-5 h-5 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="w-1/3 h-3 bg-gray-100 animate-pluse"></div>
          </div>
          <div className="flex items-center">
            <div className="mr-1 w-6 h-6 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-100 animate-pulse"></div>
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

  return (
    <ul>
      {NewsListData?.newsList.map((news) => {
        return (
          <li
            key={news.nodeId}
            className={`relative mb-4 rounded border bg-white ${
              isEditingNews(news) ? "ring-2 ring-blue-200" : ""
            }`}
          >
            {/* UI的にはリンクの中だけど、要素的にはリンクの外に配置したい */}
            {/* 管理者か自分の投稿したニュースであれば、ニュースに対してのメニュー表示 */}
            {isDisplayNewsMenu(news.user.id) && (
              <Box className="absolute top-2 right-2">
                <Menu
                  title="ニュースを編集"
                  size="xl"
                  placement="end"
                  control={
                    <UnstyledButton
                      className={`rounded-full p-1 hover:bg-gray-200 border border-transparent hover:border-gray-50 text-gray-600 ${
                        isEditingNews(news) && "hidden"
                      }`}
                    >
                      <FiChevronDown size={26} />
                    </UnstyledButton>
                  }
                >
                  {isTodaySharedAt(news.sharedAt) && (
                    <Menu.Item
                      className="hover:bg-gray-100"
                      icon={<BsCalendar />}
                      onClick={handlePostponeNews(news.nodeId, close)}
                      disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                    >
                      明日に延期する
                    </Menu.Item>
                  )}
                  {news.isViewed ? (
                    <Menu.Item
                      className="hover:bg-gray-100"
                      icon={<IoMdReturnLeft />}
                      onClick={handleToggleViewedNews(news)}
                      disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                    >
                      シェアしていない状態に戻す
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      className="hover:bg-gray-100"
                      icon={<BsCheck2 />}
                      onClick={handleToggleViewedNews(news)}
                      disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                    >
                      シェア済みにする
                    </Menu.Item>
                  )}

                  <Menu.Item
                    className="hover:bg-gray-100"
                    icon={<HiOutlinePencil />}
                    onClick={handleClickNewsEditMode(news, close)}
                    disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                  >
                    編集する
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="red"
                    className="hover:bg-red-100"
                    icon={<RiDeleteBinLine />}
                    onClick={handleDeleteNews(news.nodeId, close)}
                    disabled={isUpdateNewsLoading || isDeleteNewsLoading}
                  >
                    削除する
                  </Menu.Item>
                </Menu>
              </Box>
            )}

            {/* TODO: newsの型 最悪 as を使う */}
            {/* TODO: いいねしたときのanimation */}
            <div
              className={`absolute bottom-3 left-60 text-xs text-gray-400 outline-none ${
                isEditingNews(news) ? "bottom-16" : ""
              }`}
            >
              <Tooltip label="いいねをすると後でマイページから見返すことができます">
                <UnstyledButton
                  onClick={handleToggleLike(news.id, !isLikedNews(news as News))}
                  disabled={isUpdateNewsLoading || isDeleteNewsLoading || isToggleLikeLoading}
                >
                  {isLikedNews(news as News) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FiHeart className="w-6 h-6" />
                  )}
                </UnstyledButton>
              </Tooltip>
            </div>

            {news.isViewed && <BsCheck className="absolute left-1 top-3 w-6 h-6 text-green-400" />}

            {/* コンテンツ */}
            <a
              href={news.url}
              className={`block py-3 px-8 rounded hover:bg-gray-50 ${
                isEditingNews(news) ? "hover:bg-white cursor-default" : ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleUpdateViewedNews(news)}
            >
              <div>
                {isEditingNews(news) ? (
                  <TextInput
                    classNames={{ input: "mb-2 text-lg font-bold" }}
                    placeholder="ニュースのタイトル"
                    {...getInputProps("title")}
                  />
                ) : (
                  <h3 className="mb-2 text-lg font-bold line-clamp-1">{news.title || news.url}</h3>
                )}

                <div className="grid grid-cols-6 gap-6">
                  {isEditingNews(news) ? (
                    <TextInput
                      multiple
                      className="col-span-5 mb-2 text-sm text-gray-400 outline-none resize-none"
                      placeholder="ニュースの説明"
                      {...getInputProps("description")}
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
                  {isEditingNews(news) ? (
                    <TextInput
                      className="block flex-1 text-xs text-gray-600 outline-none"
                      type="url"
                      required
                      placeholder="https://news.com/..."
                      {...getInputProps("url")}
                    />
                  ) : (
                    <span className="block text-xs text-blue-400 underline hover:no-underline line-clamp-1">
                      {news.url}
                    </span>
                  )}
                </p>
                {/* 下のサブ情報 */}
                <div className="flex items-center">
                  <div className="flex items-center">
                    {news.user.photoUrl ? (
                      <Avatar
                        src={news.user.photoUrl}
                        alt={news.user.displayName}
                        radius="xl"
                        size="sm"
                        className="mr-1"
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
            {isEditingNews(news) && (
              <div className="flex gap-4 justify-end items-center px-4 pb-4 w-full">
                <Button variant="outline" onClick={handleClickNewsEditCancel}>
                  キャンセル
                </Button>
                <Button onClick={onSubmit(handleUpdateNews)} disabled={isUpdateNewsLoading}>
                  更新する
                </Button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

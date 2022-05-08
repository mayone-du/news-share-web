import { useCallback, useState, VFC } from "react";
import { Navbar, UnstyledButton, Avatar, Group, Text, Modal, Title, Button } from "@mantine/core";
import { AiOutlineHome } from "react-icons/ai";
import NextLink from "next/link";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import { FiSend } from "react-icons/fi";
import {
  Role,
  useCreateSlackNotificationMutation,
  useMyUserInfoQuery,
  useNewsListQuery,
  usePostponeNewsListMutation,
  useSlackNotificationQuery,
} from "src/graphql/schemas/generated/schema";
import { hyphenFormat } from "src/utils";
import dayjs from "dayjs";
import { showNotification, updateNotification } from "@mantine/notifications";
import { genId } from "src/utils/genId";

export const AppNavbar: VFC = () => {
  const { handleOpenCreateNewsModal } = useCreateNewsModal();

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
    const notificationId = genId();
    showNotification({
      id: notificationId,
      message: willPostponeNewsIds?.length
        ? "Slackへ送信とニュースの延期をしています..."
        : "Slackへ送信しています...",
    });
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
        updateNotification({
          id: notificationId,
          message: "ニュースの延期とSlackへ送信が完了しました",
        });
      } catch (e) {
        console.error(e);
        if (createSalckNotificationError)
          return updateNotification({
            id: notificationId,
            message: "Slack通知とニュースの延期に失敗しました",
          });
        updateNotification({
          id: notificationId,
          message: "ニュースの延期に失敗しました",
        });
      }
    } else {
      try {
        await createSlackNotification();
      } catch (e) {
        console.error(e);
        updateNotification({
          id: notificationId,
          message: "Slack通知の送信に失敗しました",
        });
      }
    }
    handleCloseDialog();
  };

  return (
    <Navbar width={{ base: 300 }} height={500} p="xs">
      <NextLink href="/" passHref>
        <UnstyledButton component="a" className="rounded transition-colors hover:bg-gray-200">
          <Group>
            <Avatar size={32} className="m-1">
              <AiOutlineHome size={20} />
            </Avatar>
            <Text size="xs" color="gray" className="hidden md:block">
              ホーム
            </Text>
          </Group>
        </UnstyledButton>
      </NextLink>

      <UnstyledButton
        className="rounded transition-colors hover:bg-gray-200"
        onClick={handleOpenCreateNewsModal}
      >
        <Group>
          <Avatar size={32} className="m-1">
            <IoMdAddCircleOutline size={20} />
          </Avatar>
          <Text size="xs" color="gray" className="hidden md:block">
            ニュース・記事を投稿する
          </Text>
        </Group>
      </UnstyledButton>

      <UnstyledButton
        className="rounded transition-colors hover:bg-gray-200"
        onClick={handleOpenDialog}
      >
        <Group>
          <Avatar size={32} className="m-1">
            <FiSend size={20} />
          </Avatar>
          <Text size="xs" color="gray" className="hidden md:block">
            Slackへ送信する
          </Text>
        </Group>
      </UnstyledButton>

      {myUserInfoData?.myUserInfo && myUserInfoData.myUserInfo.role == Role.User && (
        <Modal
          opened={isOpenModal}
          onClose={handleCloseDialog}
          centered
          title={
            <Title order={3} className="text-xl font-bold text-center text-gray-900">
              今日のニュースシェアを終了する
            </Title>
          }
        >
          <div className="overflow-hidden px-4 pb-4 m-auto w-80 bg-white rounded-lg transition-all transform sm:w-96">
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

            <div className="mt-6 text-center">
              <Button
                onClick={handleEndNewsShare}
                disabled={
                  isSlackNotificationLoading ||
                  isCreateSlackNotificationLoading ||
                  isPostponeNewsListLoading
                }
              >
                実行する
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Navbar>
  );
};

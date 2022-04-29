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
import toast from "react-hot-toast";
import { hyphenFormat } from "src/utils";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export const AppNavbar: VFC = () => {
  const { handleOpenCreateNewsModal } = useCreateNewsModal();

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
    <Navbar width={{ base: 300 }} height={500} p="xs">
      <NextLink href="/" passHref>
        <UnstyledButton component="a" className="rounded hover:bg-gray-200 transition-colors">
          <Group>
            <Avatar size={32} className="m-1">
              <AiOutlineHome size={20} />
            </Avatar>
            <Text size="xs" color="gray">
              ホーム
            </Text>
          </Group>
        </UnstyledButton>
      </NextLink>

      <UnstyledButton
        className="rounded hover:bg-gray-200 transition-colors"
        onClick={handleOpenCreateNewsModal}
      >
        <Group>
          <Avatar size={32} className="m-1">
            <IoMdAddCircleOutline size={20} />
          </Avatar>
          <Text size="xs" color="gray">
            ニュース・記事を投稿する
          </Text>
        </Group>
      </UnstyledButton>

      <UnstyledButton
        className="rounded hover:bg-gray-200 transition-colors"
        onClick={handleOpenDialog}
      >
        <Group>
          <Avatar size={32} className="m-1">
            <FiSend size={20} />
          </Avatar>
          <Text size="xs" color="gray">
            Slackへ送信する
          </Text>
        </Group>
      </UnstyledButton>

      {myUserInfoData.myUserInfo.role !== Role.User && (
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
                className="bg-blue-500"
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

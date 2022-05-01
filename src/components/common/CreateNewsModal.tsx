import type { Reference } from "@apollo/client";
import { Modal, Title, LoadingOverlay, TextInput, Button, Tooltip, Box } from "@mantine/core";
import { useReactiveVar } from "@apollo/client";
import { VFC } from "react";
import { isOpenCreateNewsModalVar } from "src/global/state";
import {
  NewsFragmentFragmentDoc,
  useCreateNewsMutation,
} from "src/graphql/schemas/generated/schema";
import toast from "react-hot-toast";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";

type FieldValues = {
  url: string;
};

// TODO: クリップボード読んでURLだったらTooltipで表示する
export const CreateNewsModal: VFC = () => {
  const isOpenCreateNewsModal = useReactiveVar(isOpenCreateNewsModalVar);
  const { handleCloseCreateNewsModal } = useCreateNewsModal();
  const [createNews, { loading }] = useCreateNewsMutation();
  const { onSubmit, reset, getInputProps } = useForm<FieldValues>({
    initialValues: { url: "" },
    validate: {
      url: (value) => {
        if (!value) return "URLを入力してください";
        if (!value.match(/^https?:\/\/.+/)) return "URLが不正です";
      },
    },
  });

  const handleCreateNews = async (data: FieldValues) => {
    showNotification({
      id: "createNews",
      message: "投稿中...",
    });
    try {
      await createNews({
        variables: { input: { url: data.url } },
        update: (cache, { data }) => {
          if (!data?.createNews) return;
          cache.modify({
            fields: {
              newsList: (existingNewsList: Reference[]) => {
                const createdNewsRef = cache.writeFragment({
                  data: data.createNews,
                  fragment: NewsFragmentFragmentDoc,
                });
                return [...existingNewsList, createdNewsRef];
              },
            },
          });
        },
      });
      handleCloseCreateNewsModal();
      reset();
      updateNotification({
        id: "createNews",
        message: "投稿しました",
      });
    } catch (e) {
      console.error(e);
      updateNotification({
        id: "createNews",
        message: "エラーが発生しました",
      });
    }
  };

  return (
    <Modal
      opened={isOpenCreateNewsModal}
      onClose={handleCloseCreateNewsModal}
      title={<Title order={3}>新しいニュースを投稿する</Title>}
      centered
    >
      <form onSubmit={onSubmit(handleCreateNews)}>
        <TextInput
          size="md"
          required
          label="URLを入力"
          {...getInputProps("url")}
          data-autofocus
          mb={"sm"}
          placeholder="https://qin.news/~"
        />
        <Button type="submit" loading={loading}>
          {loading ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </Modal>
  );
};

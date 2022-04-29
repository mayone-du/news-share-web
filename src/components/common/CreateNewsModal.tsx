import type { Reference } from "@apollo/client";
import { Modal, Title, LoadingOverlay, TextInput, Button } from "@mantine/core";
import { useReactiveVar } from "@apollo/client";
import type { VFC } from "react";
import { isOpenCreateNewsModalVar } from "src/global/state";
import {
  NewsFragmentFragmentDoc,
  useCreateNewsMutation,
} from "src/graphql/schemas/generated/schema";
import toast from "react-hot-toast";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import { useForm } from "@mantine/form";

type FieldValues = {
  url: string;
};

export const CreateNewsModal: VFC = () => {
  const isOpenCreateNewsModal = useReactiveVar(isOpenCreateNewsModalVar);
  const { handleCloseCreateNewsModal } = useCreateNewsModal();
  const [createNews, { loading, error }] = useCreateNewsMutation();
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
    const toastId = toast.loading("投稿中...");
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
      toast.success("投稿しました", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("投稿に失敗しました", { id: toastId });
    }
  };

  return (
    <Modal
      opened={isOpenCreateNewsModal}
      onClose={handleCloseCreateNewsModal}
      title={<Title order={6}>新しいニュースを投稿する</Title>}
      centered
    >
      <form onSubmit={onSubmit(handleCreateNews)}>
        <TextInput
          required
          label="URLを入力"
          {...getInputProps("url")}
          data-autofocus
          mb={"sm"}
          placeholder="https://qin.news/~"
        />
        <Button type="submit" loading={loading} className="bg-blue-500">
          {loading ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </Modal>
  );
};

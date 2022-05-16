import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import type { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { ROUTE_LABELS } from "src/constants/labels";
import { Layout } from "src/layouts";

type FieldValues = {
  title: string;
  content: string;
};

const ContactIndexPage: CustomNextPage = () => {
  const { getInputProps, onSubmit } = useForm<FieldValues>({
    initialValues: {
      title: "",
      content: "",
    },
    // validate: {
    //   title: (value) => {
    //     if (!value) return "タイトルを入力してください";
    //   },
    //   content: (value) => {
    //     if (!value) return "内容を入力してください";
    //   },
    // },
  });

  const handleSubmit = onSubmit((formData) => {
    alert("開発中です");
  });
  return (
    <>
      <NextSeo title={ROUTE_LABELS.CONTACT} />
      <div className="prose">
        <h1>お問い合わせ</h1>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            className="block py-1 px-2 mb-2 w-full rounded border outline-none"
            placeholder="タイトル"
            {...getInputProps("title")}
          />

          <TextInput
            placeholder="お問い合わせ内容"
            className="block py-1 px-2 mb-4 w-full rounded border outline-none resize-none"
            {...getInputProps("content")}
          />
          <button type="submit" className="block py-2 px-4 text-center rounded-md border">
            送信
          </button>
        </form>
      </div>
    </>
  );
};
export default ContactIndexPage;

ContactIndexPage.getLayout = Layout;

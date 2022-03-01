import type { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { useForm } from "react-hook-form";
import { ROUTE_LABELS } from "src/constants/labels";
import { Layout } from "src/layouts";

type ContactInputs = {
  title: string;
  content: string;
};

const ContactIndexPage: CustomNextPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ContactInputs>();
  const onSubmit = (formData: ContactInputs) => {
    alert(JSON.stringify(formData));
  };
  return (
    <>
      <NextSeo title={ROUTE_LABELS.CONTACT} />
      <div className="prose">
        <h1>お問い合わせ</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            className="block py-1 px-2 mb-4 w-full rounded border outline-none"
            placeholder="タイトル"
            {...register("title", { required: true, maxLength: 20 })}
          />
          {/* タイトルのエラーハンドリング */}
          {errors.title && (
            <p className="pb-4 text-sm text-gray-500">
              {errors.title.type === "required" ? "必須です。" : "20文字までです。"}
            </p>
          )}

          <textarea
            placeholder="お問い合わせ内容"
            className="block py-1 px-2 mb-4 w-full rounded border outline-none resize-none"
            {...register("content", { required: true })}
          ></textarea>
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

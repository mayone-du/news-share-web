import type { Reference } from "@apollo/client";
import { useReactiveVar } from "@apollo/client";
import { Dialog, Transition } from "@headlessui/react";
import type { VFC } from "react";
import { isOpenCreateNewsModalVar } from "src/global/state";
import { useForm } from "react-hook-form";
import {
  NewsFragmentFragmentDoc,
  useCreateNewsMutation,
} from "src/graphql/schemas/generated/schema";
import toast from "react-hot-toast";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";

type FieldValues = {
  url: string;
};

export const CreateNewsModal: VFC = () => {
  const isOpenCreateNewsModal = useReactiveVar(isOpenCreateNewsModalVar);
  const { handleCloseCreateNewsModal } = useCreateNewsModal();
  const [createNews, { loading, error }] = useCreateNewsMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FieldValues>();

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
    <Transition appear show={isOpenCreateNewsModal} as="div">
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10 bg-gray-400 bg-opacity-40"
        onClose={handleCloseCreateNewsModal}
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
            <div className="overflow-hidden p-6 m-auto w-80 bg-white rounded-lg shadow-xl transition-all transform sm:w-96">
              <Dialog.Title as="h3" className="text-2xl font-bold text-center text-gray-900">
                ニュースを投稿する
              </Dialog.Title>

              <form
                onSubmit={handleSubmit(handleCreateNews)}
                className="flex flex-col justify-between"
              >
                <div className="pb-2">
                  <label className="mt-6 mb-2">
                    <span className="mb-1 text-sm text-gray-500">URLを入力</span>
                    <input
                      type="url"
                      autoFocus
                      className="block py-2 px-3 mx-auto mb-2 w-full rounded border ring-blue-200 outline-none focus:ring-2"
                      placeholder="https://qin.news/..."
                      {...register("url", { required: true, maxLength: 255 })}
                    />
                  </label>
                  {errors.url && (
                    <p className="mb-2 text-sm text-red-400">
                      {errors.url.type === "required" && "URLを入力してください"}
                      {errors.url.type === "maxLength" && "URLの長さは255文字以下にしてください"}
                    </p>
                  )}
                </div>
                <button
                  disabled={loading}
                  className="block py-2 px-4 mx-auto rounded border shadow disabled:bg-gray-200"
                  type="submit"
                >
                  投稿する
                </button>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

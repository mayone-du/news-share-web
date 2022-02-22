import { useReactiveVar } from "@apollo/client";
import { Dialog, Transition } from "@headlessui/react";
import type { VFC } from "react";
import { isOpenCreateNewsModalVar } from "src/global/state";
import { useForm } from "react-hook-form";
import { useCreateNewsMutation, useNewsListLazyQuery } from "src/graphql/schemas/generated/schema";
import toast from "react-hot-toast";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import dayjs from "dayjs";
import { hyphenFormat } from "src/utils";

type FieldValues = {
  url: string;
};

export const CreateNewsModal: VFC = () => {
  const isOpenCreateNewsModal = useReactiveVar(isOpenCreateNewsModalVar);
  const { handleCloseCreateNewsModal } = useCreateNewsModal();
  const [query] = useNewsListLazyQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
  });
  const [createNews, { data, loading, error }] = useCreateNewsMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FieldValues>();

  const handleCreateNews = async (data: FieldValues) => {
    const toastId = toast.loading("投稿中...");
    try {
      await createNews({ variables: { input: { url: data.url } } });
      handleCloseCreateNewsModal();
      reset();
      await query(); // refetch
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
                <div className="mb-2">
                  <input
                    type="url"
                    autoFocus
                    className="block py-2 px-3 mt-4 mb-2 mx-auto w-full rounded border ring-blue-200 outline-none focus:ring-2"
                    {...register("url", { required: true, maxLength: 255 })}
                  />
                  {errors.url && (
                    <p className="text-sm text-red-400 mb-2">
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

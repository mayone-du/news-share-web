import type { CustomNextPage, GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { initializeApollo } from "src/graphql/apollo/client";
import {
  useMyUserInfoQuery,
  UserDocument,
  UserQuery,
  UserQueryVariables,
  UsersDocument,
  UsersQuery,
  UsersQueryVariables,
  useUpdateMyUserInfoMutation,
} from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { calcFromNow } from "src/utils";

// TODO: 型をもう少し良い感じにする
export const getStaticPaths: GetStaticPaths = async (context) => {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<UsersQuery, UsersQueryVariables>({
    query: UsersDocument,
  });
  if (!data.users?.edges) return { paths: [], fallback: true };
  return {
    paths: data.users.edges.map((user) => ({
      params: { oauthUserId: user?.node?.oauthUserId },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<UserQuery, UserQueryVariables>({
    query: UserDocument,
    variables: { input: { oauthUserId: context.params?.oauthUserId?.toString() ?? "" } },
  }); // IDからUser情報を取得
  return { props: data, revalidate: 60 * 60 * 12 }; // 半日ごと
};

type FieldValues = {
  displayName: string;
  selfIntroduction: string;
};

const UserDetailPage: CustomNextPage<UserQuery> = (props) => {
  const [updateMyUserInfo, { data, loading, error }] = useUpdateMyUserInfoMutation();
  const { data: myUserInfoData, loading: isMyUserInfoLoading } = useMyUserInfoQuery();
  const [isEditMode, setIsEditMode] = useState(false);
  const isMyUserPage = myUserInfoData?.myUserInfo?.oauthUserId === props.user?.oauthUserId;
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      displayName: props.user?.displayName,
      selfIntroduction: props.user?.selfIntroduction,
    },
  });

  const handleToggleEditMode = () => setIsEditMode((prev) => !prev);
  const handleSave = handleSubmit(async (formData) => {
    const toastId = toast.loading("保存中...");
    const { errors } = await updateMyUserInfo({ variables: { input: { ...formData } } });
    if (error || errors) {
      toast.error("保存に失敗しました", { id: toastId });
    } else {
      toast.success("保存しました", { id: toastId });
    }
    handleToggleEditMode();
  });

  if (isMyUserInfoLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex gap-10 items-start mb-8 w-full">
        <img src={props.user?.photoUrl} alt="" className="block w-28 rounded-full aspect-square" />
        {isMyUserPage && (
          <div className="flex-1">
            {isEditMode ? (
              <div className="flex justify-between items-start mb-4 w-full">
                <div className="w-2/3">
                  <input
                    type="text"
                    className="block text-2xl font-bold outline-none"
                    {...register("displayName", { required: true, maxLength: 20 })}
                  />
                  <textarea
                    className="block w-full outline-none resize-none"
                    {...register("selfIntroduction", { required: false, maxLength: 100 })}
                  />
                </div>

                <div className="flex items-center w-1/3">
                  <button
                    className="block p-1 rounded border shadow"
                    onClick={handleToggleEditMode}
                  >
                    キャンセル
                  </button>
                  <button className="block p-1 rounded border shadow" onClick={handleSave}>
                    保存する
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start mb-4 w-full">
                {/* プロフィール情報 名前と自己紹介文 */}
                <div className="w-2/3">
                  <h1 className="text-2xl font-bold">
                    {/* 更新後のデータが有ればそれを表示し、なければSSGしてあるデータを表示 */}
                    {/* TODO: オンデマンドISRを試してみる（更新時にリビルドさせる） */}
                    {data?.updateMyUserInfo?.displayName
                      ? data.updateMyUserInfo.displayName
                      : props.user?.displayName}
                  </h1>
                  <p className="text-gray-600 whitespace-pre">
                    {data?.updateMyUserInfo?.selfIntroduction
                      ? data.updateMyUserInfo.selfIntroduction
                      : props.user?.selfIntroduction}
                  </p>
                </div>
                <div className="w-1/3">
                  <button
                    className="block py-1 px-2 ml-auto rounded border shadow-sm hover:shadow"
                    onClick={handleToggleEditMode}
                  >
                    編集する
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold">いいねしたニュース一覧</h2>
        <ul className="pt-4">
          {props.user?.likes.map((like) => (
            <li key={like.id.toString()} className="p-2 rounded border-b hover:bg-gray-50">
              <a href={like.news.url} className="block">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <img
                        src={like.news.user.photoUrl}
                        className="block mr-2 w-8 h-8 rounded-full"
                        alt=""
                      />
                      <p className="font-bold">{like.news.user.displayName}</p>
                    </div>
                    <div className="text-lg font-bold line-clamp-1">{like.news.title}</div>
                    <span className="text-sm text-gray-400">
                      {calcFromNow(like.news.createdAt)}に投稿
                    </span>
                  </div>

                  {like.news.imageUrl ? (
                    <img
                      src={like.news.imageUrl}
                      className="block object-cover w-20 border aspect-square"
                      alt=""
                    />
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

UserDetailPage.getLayout = Layout;

export default UserDetailPage;

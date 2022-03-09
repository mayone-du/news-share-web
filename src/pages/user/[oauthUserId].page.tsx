import type { CustomNextPage, GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
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

const UserDetailPage: CustomNextPage<UserQuery> = (props) => {
  const [updateMyUserInfo, { data, loading, error }] = useUpdateMyUserInfoMutation();
  const { data: myUserInfoData, loading: isMyUserInfoLoading } = useMyUserInfoQuery();
  const [isEditMode, setIsEditMode] = useState(false);
  const isMyUserPage = myUserInfoData?.myUserInfo?.oauthUserId === props.user?.oauthUserId;

  const handleToggleEditMode = () => setIsEditMode((prev) => !prev);

  if (isMyUserInfoLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex w-full gap-10 mb-8">
        <img src={props.user?.photoUrl} alt="" className="block w-28 rounded-full aspect-square" />
        {isMyUserPage && (
          <div className="flex-1">
            {isEditMode ? (
              <div className="flex items-center w-full justify-between mb-4">
                <input
                  type="text"
                  className="block border p-1 rounded"
                  defaultValue={props.user?.displayName}
                />
                <div className="flex items-center">
                  <button
                    className="block border p-1 rounded shadow"
                    onClick={handleToggleEditMode}
                  >
                    キャンセル
                  </button>
                  <button
                    className="block border p-1 rounded shadow"
                    onClick={() => alert("ちょいまち")}
                  >
                    保存する
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full justify-between mb-4">
                <h1 className="text-2xl font-bold">{props.user?.displayName}</h1>
                <button
                  className="rounded border shadow-sm hover:shadow py-1 px-2"
                  onClick={handleToggleEditMode}
                >
                  プロフィールを編集する
                </button>
              </div>
            )}
            <p className="text-gray-600">{props.user?.selfIntroduction}</p>
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

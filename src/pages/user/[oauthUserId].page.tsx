import type { CustomNextPage, GetStaticPaths, GetStaticProps } from "next";
import { initializeApollo } from "src/graphql/apollo/client";
import {
  UserDocument,
  UserQuery,
  UserQueryVariables,
  UsersDocument,
  UsersQuery,
  UsersQueryVariables,
} from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";

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
  return { props: data, revalidate: 1000 * 60 * 60 * 12 }; // 半日ごと
};

const UserDetailPage: CustomNextPage<UserQuery> = (props) => {
  return (
    <div>
      <div className="flex gap-10">
        <img src={props.user?.photoUrl} alt="" className="block aspect-square w-28 rounded-full" />
        <div>
          <h1 className="mb-4 text-2xl font-bold">{props.user?.displayName}</h1>
          <p className="text-gray-600">{props.user?.selfIntroduction}</p>
        </div>
      </div>
      <ul>
        {props.user?.likes.map((like) => (
          <li key={like.id.toString()}>{like.news.title}</li>
        ))}
      </ul>
    </div>
  );
};

UserDetailPage.getLayout = Layout;

export default UserDetailPage;

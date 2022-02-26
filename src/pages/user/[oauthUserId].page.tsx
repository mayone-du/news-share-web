import type { CustomNextPage, GetStaticPaths, GetStaticProps } from "next";
import { initializeApollo } from "src/graphql/apollo/client";
import {
  UserQuery,
  UserQueryVariables,
  UsersDocument,
  UsersQuery,
  UsersQueryVariables,
} from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";

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
  // const { oauthUserId } = context.params;
  console.log(context.params);
  const { data } = await apolloClient.query<UserQuery, UserQueryVariables>({
    query: UsersDocument,
  }); // IDからUser情報を取得
  return { props: data };
};

const UserDetailPage: CustomNextPage<UserQuery> = (props) => {
  console.log(props);
  return <div>{props.user?.displayName}</div>;
};

UserDetailPage.getLayout = Layout;

export default UserDetailPage;

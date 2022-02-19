import { useReactiveVar } from "@apollo/client";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { userInfoVar } from "src/global/state";
import { initializeApollo } from "src/graphql/apollo/client";
import { useAuthModal } from "src/hooks/useAuthModal";
import { Footer } from "src/layouts/Footer";
import { Header } from "src/layouts/Header";
import { LayoutErrorBoundary } from "src/layouts/LayoutErrorBoundary";

// pagesのgetLayoutで指定されたページで呼ばれる。ページのリロード時に呼ばれ、ページ遷移時には呼ばれない。
export const Layout = (page: NextPage) => {
  const userInfo = useReactiveVar(userInfoVar);
  const { AuthModal } = useAuthModal();

  // 初回マウント時にユーザー情報を取得し、ReactiveVariablesでグローバル管理して、_appで値を参照する
  useEffect(() => {
    console.log("Layout.useEffect");
    if (!userInfo.isLoading) return;
    (async () => {
      const session = await getSession();
      if (!session) return userInfoVar({ ...userInfo, isLoading: false });
      userInfoVar({
        isLoading: false,
        isAuthenticated: true,
        userId: "1",
      });

      // session情報があればユーザー情報を取得し、Reactive Variablesでグローバル管理
      console.log("session", session);
      // const apolloClient = initializeApollo();
      // const { data } = await apolloClient.query<
      //   GetMyUserInfoQuery,
      //   GetMyUserInfoQueryVariables
      // >({
      //   query: GetMyUserInfoDocument,
      // });
    })();
  }, []);

  return (
    <div>
      <AuthModal />
      <Header />
      <main className="px-4 mx-auto md:px-60 lg:px-72">
        <LayoutErrorBoundary>{page}</LayoutErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

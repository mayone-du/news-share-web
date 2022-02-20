import { useReactiveVar } from "@apollo/client";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { userInfoVar } from "src/global/state";
import { initializeApollo } from "src/graphql/apollo/client";
import { useAuthModal } from "src/hooks/useAuthModal";
import { useCreateNewsModal } from "src/hooks/useCreateNewsModal";
import { Footer } from "src/layouts/Footer";
import { Header } from "src/layouts/Header";
import { LayoutErrorBoundary } from "src/layouts/LayoutErrorBoundary";
import { SidebarLeft } from "src/layouts/SidebarLeft";

// pagesのgetLayoutで指定されたページで呼ばれる。ページのリロード時に呼ばれ、ページ遷移時には呼ばれない。
export const Layout = (page: NextPage) => {
  const userInfo = useReactiveVar(userInfoVar);
  const { AuthModal } = useAuthModal();
  const { CreateNewsModal } = useCreateNewsModal();

  // 初回マウント時にユーザー情報を取得し、ReactiveVariablesでグローバル管理して、_appで値を参照する
  useEffect(() => {
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
      <CreateNewsModal />
      <Header />
      <div className="grid grid-cols-5 gap-8 px-12 pt-8 mx-auto max-w-[1680px]">
        <div className="col-span-1">
          <SidebarLeft />
        </div>
        <main className="col-span-3">
          <LayoutErrorBoundary>{page}</LayoutErrorBoundary>
        </main>
        <div className="col-span-1 bg-lime-100">hoge{/* <SidebarRight /> */}</div>
      </div>
      <Footer />
    </div>
  );
};

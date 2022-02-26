import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { CreateNewsModal } from "src/components/common";
import { AuthModal } from "src/components/common";
import { initializeApollo } from "src/graphql/apollo/client";
import {
  MyUserInfoDocument,
  MyUserInfoQuery,
  MyUserInfoQueryVariables,
} from "src/graphql/schemas/generated/schema";
import { Footer } from "src/layouts/Footer";
import { Header } from "src/layouts/Header";
import { LayoutErrorBoundary } from "src/layouts/LayoutErrorBoundary";
import { SidebarLeft } from "src/layouts/SidebarLeft";
import { SidebarRight } from "src/layouts/SidebarRight";

// pagesのgetLayoutで指定されたページで呼ばれる。ページのリロード時に呼ばれ、ページ遷移時には呼ばれない。
export const Layout = (page: NextPage) => {
  // 初回マウント時にユーザー情報を取得し、ReactiveVariablesでグローバル管理して、_appで値を参照する
  useEffect(() => {
    (async () => {
      const session = await getSession();
      try {
        if (!session) return;
        // session情報があればユーザー情報を取得しておき、以降はcache-onlyで読み込む
        const apolloClient = initializeApollo();
        const { error } = await apolloClient.query<MyUserInfoQuery, MyUserInfoQueryVariables>({
          query: MyUserInfoDocument,
        });
        if (error) throw error;
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <AuthModal />
      <CreateNewsModal />
      <Header />
      <div className="grid lg:grid-cols-4 grid-cols-8 lg:gap-8 gap-4 lg:px-44 px-10 pt-8 mx-auto max-w-[1680px]">
        <div className="col-span-1">
          <SidebarLeft />
        </div>
        <main className="col-span-6 lg:col-span-2">
          <LayoutErrorBoundary>{page}</LayoutErrorBoundary>
        </main>
        <div className="col-span-1">
          <SidebarRight />
        </div>
      </div>
      <Footer />
    </div>
  );
};

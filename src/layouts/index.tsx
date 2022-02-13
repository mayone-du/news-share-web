import { useReactiveVar } from "@apollo/client";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { idTokenVar, userInfoVar } from "src/global/state";
import { initializeApollo } from "src/graphql/apollo/client";
import type {
  GetMyUserInfoQuery,
  GetMyUserInfoQueryVariables,
} from "src/graphql/schemas/generated/schema";
import { GetMyUserInfoDocument } from "src/graphql/schemas/generated/schema";
import { useAuthModal } from "src/hooks/useAuthModal";
import { Footer } from "src/layouts/Footer";
import { Header } from "src/layouts/Header";
import { LayoutErrorBoundary } from "src/layouts/LayoutErrorBoundary";

// pagesのgetLayoutで指定されたページで呼ばれる。ページのリロード時に呼ばれ、ページ遷移時には呼ばれない。
export const Layout = (page: NextPage) => {
  const idToken = useReactiveVar(idTokenVar);
  const { AuthModal } = useAuthModal();

  // 初回マウント時にユーザー情報を取得し、ReactiveVariablesでグローバル管理して、_appで値を参照する
  useEffect(() => {
    // idTokenが設定されていなければsessionからidTokenを取得し、セットする
    if (idToken === "") {
      (async () => {
        const session = await getSession();
        // nextauthのapiルートでsessionにidTokenをセットしているためstring型を強制
        const idToken = session?.idToken as string;
        idTokenVar(idToken);

        // session情報があればユーザー情報を取得し、Reactive Variablesでグローバル管理
        if (session) {
          const apolloClient = initializeApollo(null, idToken);
          const { data } = await apolloClient.query<
            GetMyUserInfoQuery,
            GetMyUserInfoQueryVariables
          >({
            query: GetMyUserInfoDocument,
          });

          userInfoVar({
            isLoading: false,
            isAuthenticated: true,
            userId: data.myUserInfo?.id ?? "",
          });
        }

        // グローバル管理しているユーザー情報を更新
        userInfoVar({
          userId: "",
          isLoading: false,
          isAuthenticated: false,
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AuthModal />
      <Header />
      <main className="px-4 md:px-60 lg:px-72 mx-auto">
        <LayoutErrorBoundary>{page}</LayoutErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

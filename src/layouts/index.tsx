import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect, VFC } from "react";
import { CreateNewsModal } from "src/components/common";
import { AuthModal } from "src/components/common";
import { initializeApollo } from "src/graphql/apollo/client";
import {
  MyUserInfoDocument,
  MyUserInfoQuery,
  MyUserInfoQueryVariables,
} from "src/graphql/schemas/generated/schema";
import { Footer } from "src/layouts/AppFooter";
import { LayoutErrorBoundary } from "src/layouts/LayoutErrorBoundary";
import { SidebarLeft } from "src/layouts/SidebarLeft";
import { SidebarRight } from "src/layouts/SidebarRight";
import { AppShell, Box, Grid } from "@mantine/core";
import { AppHeader } from "src/layouts/AppHeader";
import { AppNavbar } from "src/layouts/AppNavbar";

// pagesのgetLayoutで指定されたページで呼ばれる。ページのリロード時に呼ばれ、ページ遷移時には呼ばれない。
export const Layout: VFC<NextPage> = (page) => {
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
    <AppShell
      padding="md"
      navbar={<AppNavbar />}
      header={<AppHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <AuthModal />
      <CreateNewsModal />
      <Grid>
        <Grid.Col span={9}>{page}</Grid.Col>
        <Grid.Col span={3}>hoge</Grid.Col>
      </Grid>
    </AppShell>
  );
};

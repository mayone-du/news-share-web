import { useReactiveVar } from "@apollo/client";
import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { NotAuth } from "src/components/NotAuth";
import { UserLoading } from "src/components/UserLoading";
import { TITLES } from "src/constants/titles";
import { userInfoVar } from "src/graphql/apollo/cache";
import { Layout } from "src/layouts";

const IndexPage: CustomNextPage = () => {
  const userInfo = useReactiveVar(userInfoVar);

  const handleClick = useCallback(() => {
    toast.success("ボタンがクリックされました。");
  }, []);

  return (
    <>
      <NextSeo title={TITLES.HOME} />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "HOME",
            item: "http://localhost:3000/",
          },
        ]}
      />
      {userInfo.isLoading ? (
        // ユーザー情報のローディング
        <UserLoading />
      ) : !userInfo.isLoading && !userInfo.isAuthenticated ? (
        // 非ログイン時
        <NotAuth />
      ) : (
        // 通常時
        <div>
          <button className="block p-4 mx-auto rounded-md border" onClick={handleClick}>
            ボタン
          </button>
        </div>
      )}
    </>
  );
};

export default IndexPage;

IndexPage.getLayout = Layout;

import { useReactiveVar } from "@apollo/client";
import dayjs from "dayjs";
import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { NewsList } from "src/components/NewsList";
import { NotAuth } from "src/components/NotAuth";
import { UserLoading } from "src/components/UserLoading";
import { TITLES } from "src/constants/titles";
import { userInfoVar } from "src/global/state";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";

const IndexPage: CustomNextPage = () => {
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
      <NewsList />
    </>
  );
};

export default IndexPage;

IndexPage.getLayout = Layout;

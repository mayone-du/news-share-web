import { Title } from "@mantine/core";
import dayjs from "dayjs";
import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS, QUERY_PARAM_LABELS } from "src/constants/labels";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { QueryParams } from "src/types";
import { hyphenFormat } from "src/utils";

const today = dayjs();

// TODO: pagesディレクトリをトップレベルにして、src以下はコンポーネントのみのpagesを定義する
const IndexPage: CustomNextPage = () => {
  const { query, isReady } = useRouter();
  const queryParams: QueryParams = {
    sharedAt: query.sharedAt?.toString(),
    url: query.url?.toString(),
    title: query.title?.toString(),
    description: query.description?.toString(),
  };

  // TODO: 不正なクエリパラメーターが指定された場合のハンドリング
  // useEffect(() => {
  //   if (Object.entries(queryParams).map(([_key, value]) => value !== "")) return;
  //   console.log(queryParams);
  // }, []);

  // 値が存在するクエリパラメーター
  const paramKey = Object.entries(queryParams)
    .map(([key, value]) => {
      if (value) return key;
    })
    .filter((key): key is keyof QueryParams | undefined => key !== undefined)[0];

  const newsListQueryResult = useNewsListQuery({
    variables: {
      input: {
        ...queryParams,
        sharedAt: queryParams.sharedAt ? queryParams.sharedAt : today.format(hyphenFormat),
      },
    },
    pollInterval: 1000 * 30, // milli secondなのでこの場合は30秒ごとにポーリング
  });

  const newsCount = newsListQueryResult.data?.newsList?.length ?? 0;
  const title =
    paramKey === "title" || paramKey === "description" || paramKey === "url"
      ? `${QUERY_PARAM_LABELS[paramKey]}に "${queryParams[paramKey]}" を含むニュース ${
          newsListQueryResult.loading ? "" : newsCount + "件"
        }`
      : `${(queryParams.sharedAt ? dayjs(queryParams.sharedAt) : today).format(
          "M月D日（dd）",
        )}のニュース ${newsCount}件`;

  return (
    <>
      <NextSeo title={title} />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "HOME",
            item: "http://localhost:3000/",
          },
        ]}
      />
      <Title order={1} mb="md">
        {isReady && title}
      </Title>
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

IndexPage.getLayout = Layout;

export default IndexPage;

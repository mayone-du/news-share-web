import { Title } from "@mantine/core";
import dayjs from "dayjs";
import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS } from "src/constants/labels";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { QueryParams } from "src/types";
import { hyphenFormat } from "src/utils";

const today = dayjs().format(hyphenFormat);

// TODO: pagesディレクトリをトップレベルにして、src以下はコンポーネントのみのpagesを定義する
const IndexPage: CustomNextPage = () => {
  const { query } = useRouter();
  const queryParams: QueryParams = {
    sharedAt: query.sharedAt?.toString() || today,
    title: query.title?.toString(),
    description: query.description?.toString(),
    url: query.url?.toString(),
    searchFrag: query.searchFrag?.toString() === "text" ? "text" : "date", // クエリパラメーターが不正な場合や存在しない場合は日付検索
  };

  const newsListQueryResult = useNewsListQuery({
    variables: {
      input: {
        sharedAt: queryParams.searchFrag === "date" ? queryParams.sharedAt : undefined,
        title: queryParams.searchFrag === "text" ? queryParams.title : undefined,
        description: queryParams.searchFrag === "text" ? queryParams.description : undefined,
        url: queryParams.searchFrag === "text" ? queryParams.url : undefined,
      },
    },
    pollInterval: 1000 * 30, // milli secondなのでこの場合は30秒ごとにポーリング
  });
  const title = `${dayjs().format("M月D日（dd）")}のニュース ${
    newsListQueryResult?.data?.newsList?.length ?? 0
  }件`;

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
        {title}
      </Title>
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

IndexPage.getLayout = Layout;

export default IndexPage;

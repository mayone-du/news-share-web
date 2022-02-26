import dayjs from "dayjs";
import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS } from "src/constants/labels";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { hyphenFormat } from "src/utils";

// TODO: pagesディレクトリをトップレベルにして、src以下はコンポーネントのみのpagesを定義する
const IndexPage: CustomNextPage = () => {
  const newsListQueryResult = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
    pollInterval: 1000 * 30, // milli secondなのでこの場合は30秒ごとにポーリング
  });
  return (
    <>
      <NextSeo title={ROUTE_LABELS.INDEX} />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "HOME",
            item: "http://localhost:3000/",
          },
        ]}
      />
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

export default IndexPage;

IndexPage.getLayout = Layout;

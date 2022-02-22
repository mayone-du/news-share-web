import dayjs from "dayjs";
import { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS } from "src/constants";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { hyphenFormat } from "src/utils";

const ArchiveIndexPage: CustomNextPage = () => {
  const newsListQueryResult = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().subtract(1, "day").format(hyphenFormat) } },
  });
  return (
    <>
      <NextSeo title={ROUTE_LABELS.ARCHIVE} />
      <input type="date" />
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

ArchiveIndexPage.getLayout = Layout;

export default ArchiveIndexPage;

import dayjs from "dayjs";
import type { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS } from "src/constants";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { hyphenFormat } from "src/utils";

const ArchiveIndexPage: CustomNextPage = () => {
  const yesterday = dayjs().subtract(1, "day").format(hyphenFormat);
  const [searchDate, setSearchDate] = useState(yesterday);
  const newsListQueryResult = useNewsListQuery({
    variables: { input: { sharedAt: searchDate } },
  });
  const handleChangeSearchDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setSearchDate(dayjs(e.target.value).format(hyphenFormat));
  };
  return (
    <>
      <NextSeo title={ROUTE_LABELS.ARCHIVE} />
      <input
        type="date"
        className="block py-2 px-4 mb-4 w-full rounded border"
        onChange={handleChangeSearchDate}
        value={searchDate}
      />
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

ArchiveIndexPage.getLayout = Layout;

export default ArchiveIndexPage;

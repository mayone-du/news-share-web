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
  const tomorrow = dayjs().add(1, "day").format(hyphenFormat);
  const [searchDate, setSearchDate] = useState(yesterday);
  const newsListQueryResult = useNewsListQuery({
    variables: { input: { sharedAt: searchDate } },
  });
  const handleChangeSearchDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setSearchDate(dayjs(e.target.value).format(hyphenFormat));
  };
  const handleChangeSearchYesterDay = () => setSearchDate(yesterday);
  const handleChangeSearchTomorrow = () => setSearchDate(tomorrow);

  return (
    <>
      <NextSeo title={ROUTE_LABELS.ARCHIVE} />
      <div className="flex items-center justify-between mb-4">
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            searchDate === yesterday ? "bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchYesterDay}
        >
          昨日
        </button>
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            searchDate === tomorrow ? "bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchTomorrow}
        >
          明日
        </button>
      </div>
      <input
        type="date"
        className="block py-2 px-4 mb-4 w-full rounded border border-gray-500 outline-none"
        onChange={handleChangeSearchDate}
        value={searchDate}
      />
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

ArchiveIndexPage.getLayout = Layout;

export default ArchiveIndexPage;

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
import { useDebouncedCallback } from "use-debounce";

const YESTERDAY = dayjs().subtract(1, "day").format(hyphenFormat);
const TOMORROW = dayjs().add(1, "day").format(hyphenFormat);

const ArchiveIndexPage: CustomNextPage = () => {
  const [searchDate, setSearchDate] = useState(YESTERDAY);
  const newsListQueryResult = useNewsListQuery({
    variables: { input: { sharedAt: searchDate } },
  });

  console.log(searchDate);
  const debounced = useDebouncedCallback((val) => setSearchDate(val), 1000); // milli secound
  const handleChangeSearchDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    debounced(dayjs(e.target.value).format(hyphenFormat));
  };

  const handleChangeSearchYesterDay = () => setSearchDate(YESTERDAY);
  const handleChangeSearchTomorrow = () => setSearchDate(TOMORROW);

  return (
    <>
      <NextSeo title={ROUTE_LABELS.ARCHIVE} />
      <div className="flex items-center justify-between mb-4">
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            searchDate === YESTERDAY ? "bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchYesterDay}
        >
          昨日
        </button>
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            searchDate === TOMORROW ? "bg-blue-50" : ""
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
        defaultValue={searchDate}
      />
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

ArchiveIndexPage.getLayout = Layout;

export default ArchiveIndexPage;

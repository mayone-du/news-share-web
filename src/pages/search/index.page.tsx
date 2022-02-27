import dayjs from "dayjs";
import { Switch } from "@headlessui/react";
import type { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS } from "src/constants";
import { NewsListQueryVariables, useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { Layout } from "src/layouts";
import { hyphenFormat } from "src/utils";
import { useDebouncedCallback } from "use-debounce";

type FieldValues = Pick<NewsListQueryVariables["input"], "title" | "description" | "url">;

const YESTERDAY = dayjs().subtract(1, "day").format(hyphenFormat);
const TOMORROW = dayjs().add(1, "day").format(hyphenFormat);

const ArchiveIndexPage: CustomNextPage = () => {
  const [isTextSearch, setIsTextSearch] = useState(false);
  const [searchDate, setSearchDate] = useState(YESTERDAY);
  const [searchTexts, setSearchTexts] = useState<FieldValues>({
    title: undefined,
    description: undefined,
    url: undefined,
  });
  const newsListQueryResult = useNewsListQuery({
    variables: {
      input: {
        sharedAt: isTextSearch ? undefined : searchDate, // テキストで検索する場合は日付は含めない
        title: isTextSearch ? searchTexts.title : undefined, // TODO: 日付で検索する場合は含めない。 省略できそう
        description: isTextSearch ? searchTexts.description : undefined,
        url: isTextSearch ? searchTexts.url : undefined,
      },
    },
  });
  const searchDateDebounced = useDebouncedCallback((val) => setSearchDate(val), 1000); // milli secound
  const searchTextsDebounced = useDebouncedCallback((val) => setSearchTexts(val), 1000); // milli secound

  const handleChangeSearchDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    searchDateDebounced(dayjs(e.target.value).format(hyphenFormat));
  };
  const handleChangeTexts = (e: ChangeEvent<HTMLInputElement>) => {
    searchTextsDebounced({ ...searchTexts, [e.target.name]: e.target.value });
  };

  const handleChangeSearchYesterDay = () => setSearchDate(YESTERDAY);
  const handleChangeSearchTomorrow = () => setSearchDate(TOMORROW);

  return (
    <>
      <NextSeo title={ROUTE_LABELS.SEARTCH} />
      <div>
        <Switch checked={isTextSearch} onChange={setIsTextSearch}>
          {isTextSearch ? "テキスト検索" : "日付検索"}
        </Switch>

        <input
          type="text"
          name="title"
          className="block w-full border rounded py-2 px-4 mb-4 outline-none"
          placeholder="title"
          onChange={handleChangeTexts}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            searchDate === YESTERDAY ? "bg-blue-50 hover:bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchYesterDay}
        >
          昨日
        </button>
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            searchDate === TOMORROW ? "bg-blue-50 hover:bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchTomorrow}
        >
          明日
        </button>
      </div>
      <input
        type="date"
        className="block py-2 px-4 mb-4 w-full rounded border outline-none"
        onChange={handleChangeSearchDate}
        defaultValue={searchDate}
      />
      <NewsList newsListQueryResult={newsListQueryResult} />
    </>
  );
};

ArchiveIndexPage.getLayout = Layout;

export default ArchiveIndexPage;

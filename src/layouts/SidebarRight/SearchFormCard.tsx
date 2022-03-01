import type { SyntheticEvent, VFC } from "react";
import dayjs from "dayjs";
import { Switch } from "@headlessui/react";
import { useRef, createRef, useState } from "react";
import type { ChangeEvent } from "react";
import { NewsListQueryVariables } from "src/graphql/schemas/generated/schema";
import { hyphenFormat, YESTERDAY, TOMORROW } from "src/utils";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import { GrPowerReset } from "react-icons/gr";
import { Tooltip } from "src/components/common/Tooltip";
import { SEARCH_LABELS } from "src/constants";

export type SearchFieldValues = Required<
  Pick<NewsListQueryVariables["input"], "title" | "description" | "url">
>;
// TODO: 型を値にしたいけどこうするしか無い？ もっといい方法ありそう。labelもふくめ
// 配列でも良さそう
const inputFields: SearchFieldValues = {
  title: "",
  description: "",
  url: "",
} as const;

export const SearchFormCard: VFC = () => {
  const router = useRouter();
  const [isTextSearch, setIsTextSearch] = useState(false);
  const searchDateInputRef = useRef<HTMLInputElement>(null);
  const searchDateDebounced = useDebouncedCallback((val: string) => {
    router.query.sharedAt = val;
  }, 1000); // milli secound
  const queryParamsDebounced = useDebouncedCallback((val: NextRouter) => router.push(val), 1000); // milli secound

  const handleChangeSearchDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    router.query["sharedAt"] = e.target.value;
    searchDateDebounced(dayjs(e.target.value).format(hyphenFormat));
    queryParamsDebounced(router);
  };
  const handleChangeTexts = (e: ChangeEvent<HTMLInputElement>) => {
    // 値があれば追加し、ない場合はそのパラメーターのみ削除
    if (e.target.value) {
      router.query[e.target.name] = e.target.value;
    } else {
      delete router.query[e.target.name];
    }
    queryParamsDebounced(router);
  };

  const handleChangeSearchYesterDay = () => {
    searchDateInputRef?.current && (searchDateInputRef.current.value = YESTERDAY);
    router.query["sharedAt"] = YESTERDAY;
    queryParamsDebounced(router);
  };
  const handleChangeSearchTomorrow = () => {
    searchDateInputRef?.current && (searchDateInputRef.current.value = TOMORROW);
    router.query["sharedAt"] = TOMORROW;
    queryParamsDebounced(router);
  };

  const handleResetSearch = () => {
    searchDateInputRef.current && (searchDateInputRef.current.value = "");
    setIsTextSearch(false);
    router.push("/", undefined, { shallow: true });
  };
  const handleDisableSubmit = (e: SyntheticEvent) => e.preventDefault();

  return (
    <form className="border p-4 rounded" onSubmit={handleDisableSubmit}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Tooltip tooltipText={"テキストか日付かのどちらかで検索することができます"}>
            <Switch
              checked={isTextSearch}
              onChange={setIsTextSearch}
              className="border rounded shadow text-sm py-1 px-2"
            >
              {isTextSearch ? "テキスト検索" : "日付検索"}
            </Switch>
          </Tooltip>
          <Tooltip tooltipText="検索条件をリセットする">
            <button className="block p-2 rounded-full border shadow" onClick={handleResetSearch}>
              <GrPowerReset className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* TODO: keysに型がついていない */}
        {Object.keys(inputFields).map((name) => (
          <input
            key={name}
            type="text"
            name={name}
            className="block w-full border rounded py-2 px-4 mb-4 outline-none"
            placeholder={SEARCH_LABELS[name as keyof typeof inputFields]} // TODO: as  をやめる
            onChange={handleChangeTexts}
          />
        ))}
      </div>

      <input
        type="date"
        ref={searchDateInputRef}
        className="block py-2 px-4 mb-4 w-full rounded border outline-none"
        onChange={handleChangeSearchDate}
      />
      <div className="flex justify-between items-center mb-4">
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            router.query.sharedAt === YESTERDAY ? "bg-blue-50 hover:bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchYesterDay}
        >
          昨日
        </button>
        <button
          className={`block border rounded px-4 py-2 shadow hover:bg-gray-50 transition-colors ${
            router.query.sharedAt === TOMORROW ? "bg-blue-50 hover:bg-blue-50" : ""
          }`}
          onClick={handleChangeSearchTomorrow}
        >
          明日
        </button>
      </div>
    </form>
  );
};

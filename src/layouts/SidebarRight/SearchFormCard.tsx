import type { VFC } from "react";
import dayjs from "dayjs";
import { Switch } from "@headlessui/react";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { NewsListQueryVariables } from "src/graphql/schemas/generated/schema";
import { hyphenFormat, YESTERDAY, TOMORROW } from "src/utils";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";

type FieldValues = Required<Pick<NewsListQueryVariables["input"], "title" | "description" | "url">>;
// TODO: 型を値にしたいけどこうするしか無い？
const inputFields: FieldValues = {
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

  return (
    <div className="border p-4 rounded">
      <div>
        <Switch checked={isTextSearch} onChange={setIsTextSearch}>
          {isTextSearch ? "テキスト検索" : "日付検索"}
        </Switch>

        {Object.keys(inputFields).map((name) => (
          <input
            key={name}
            type="text"
            name={name}
            className="block w-full border rounded py-2 px-4 mb-4 outline-none"
            placeholder={name}
            onChange={handleChangeTexts}
          />
        ))}
      </div>
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
      <input
        type="date"
        ref={searchDateInputRef}
        className="block py-2 px-4 mb-4 w-full rounded border outline-none"
        onChange={handleChangeSearchDate}
      />
    </div>
  );
};
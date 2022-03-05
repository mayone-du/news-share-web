import { SyntheticEvent, useEffect, VFC } from "react";
import dayjs from "dayjs";
import { Switch, Tab } from "@headlessui/react";
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
import { useForm } from "react-hook-form";
import { SearchFragKind } from "src/types";

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

// TODO: 検索の制御方法の大幅見直し
// controlledなものにしてボタンをトリガにするのかや、rhfの使用を検討する
// TODO: next/routerの使い方を見る。warnが出ているため修正 https://stackoverflow.com/questions/70318417/nextjs-router-push-unknown-key-passed-via-urlobject
export const SearchFormCard: VFC = () => {
  const router = useRouter();
  const searchDateInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // タブの選択中のインデックス

  const searchDateDebounced = useDebouncedCallback((val: string) => {
    router.query.sharedAt = val;
  }, 300); // milli secound
  const queryParamsDebounced = useDebouncedCallback((val: NextRouter) => router.push(val), 300); // milli secound

  const handleChangeSearchDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    router.query.sharedAt = e.target.value;
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
    router.query.searchFrag = "text"; // TODO: 型がいっさいついてないのでなんとかする。query.系はすべて。
    queryParamsDebounced(router);
  };

  const handleChangeSearchYesterDay = () => {
    searchDateInputRef?.current && (searchDateInputRef.current.value = YESTERDAY);
    router.query.sharedAt = YESTERDAY;
    router.query.searchFrag = "date";
    queryParamsDebounced(router);
  };
  const handleChangeSearchTomorrow = () => {
    searchDateInputRef?.current && (searchDateInputRef.current.value = TOMORROW);
    router.query.sharedAt = TOMORROW;
    router.query.searchFrag = "date";
    queryParamsDebounced(router);
  };

  const handleResetSearch = () => {
    searchDateInputRef.current && (searchDateInputRef.current.value = "");
    setSelectedIndex(0);
    router.push({ pathname: "/" }, undefined, { shallow: true });
  };
  const handleDisableSubmit = (e: SyntheticEvent) => e.preventDefault();

  return (
    <form onSubmit={handleDisableSubmit}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3>
            検索
            <span className="inline-block px-2 ml-3 text-xs font-bold text-white bg-red-500 rounded">
              Beta
            </span>
          </h3>
          <Tooltip tooltipText="検索条件をリセットする">
            <button className="block p-2 rounded-full border shadow" onClick={handleResetSearch}>
              <GrPowerReset className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex gap-2 items-center p-2 mb-4 w-full bg-gray-50 rounded">
            <Tab
              className={({ selected }) =>
                `w-full rounded outline-none focus:ring-2 ring-blue-200 hover:bg-gray-200 py-1 px-2 ${
                  selected ? "bg-blue-100 hover:bg-blue-100" : ""
                }`
              }
            >
              日付
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded outline-none focus:ring-2 ring-blue-200 hover:bg-gray-200 py-1 px-2 ${
                  selected ? "bg-blue-100 hover:bg-blue-100" : ""
                }`
              }
            >
              テキスト
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
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
            </Tab.Panel>
            <Tab.Panel>
              {/* TODO: keysに型がついていない */}
              {Object.keys(inputFields).map((name) => (
                <input
                  key={name}
                  type="text"
                  name={name}
                  className="block py-2 px-4 mb-4 w-full rounded border outline-none"
                  placeholder={SEARCH_LABELS[name as keyof typeof inputFields]} // TODO: as  をやめる
                  onChange={handleChangeTexts}
                />
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </form>
  );
};

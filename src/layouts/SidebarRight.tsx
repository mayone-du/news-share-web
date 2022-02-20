import dayjs from "dayjs";
import type { VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat } from "src/utils";

export const SidebarRight: VFC = () => {
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
  });

  return (
    <aside className="border rounded p-4">
      <h3 className="text-lg">
        {loading && "読み込み中..."}
        {error && "エラーが発生しました"}
        {data?.newsList.length ? (
          <div>
            今日のニュース<span className="font-bold mx-2 text-xl">{data.newsList.length}</span>件
          </div>
        ) : (
          "ニュースはまだありません"
        )}
      </h3>
    </aside>
  );
};

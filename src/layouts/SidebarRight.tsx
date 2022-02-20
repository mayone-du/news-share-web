import dayjs from "dayjs";
import type { VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat } from "src/utils";

export const SidebarRight: VFC = () => {
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
  });

  return (
    <aside className="p-4 rounded border">
      <h3 className="text-lg">
        {error && "エラーが発生しました"}
        {loading ? (
          "読み込み中..."
        ) : data?.newsList.length ? (
          <div>
            今日のニュース<span className="mx-2 text-xl font-bold">{data.newsList.length}</span>件
          </div>
        ) : (
          "ニュースはまだありません"
        )}
      </h3>
    </aside>
  );
};

import dayjs from "dayjs";
import type { VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat, isStartedNewsShare } from "src/utils";

export const SidebarRight: VFC = () => {
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
  });

  return (
    <aside className="flex flex-col gap-4">
      <div className="p-4 border rounded">
        <h3>{isStartedNewsShare ? "ニュースシェア中" : "ニュースを共有してみよう"}</h3>
        <p>{dayjs().format("hh:mm")}</p>
      </div>

      <h3 className="text-lg p-4 rounded border">
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

      <div className="p-4 rounded border">延期済みのニュースを見れるようにする</div>

      <div className="p-4 rounded border">Twitterで探す→的な？</div>
    </aside>
  );
};

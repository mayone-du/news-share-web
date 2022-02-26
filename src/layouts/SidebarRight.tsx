import dayjs from "dayjs";
import { useEffect, useState, VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat, isStartedNewsShare } from "src/utils";

// TODO: コンポーネント分割
export const SidebarRight: VFC = () => {
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
  });
  const [state, setState] = useState(false);

  // 1分毎に再レンダリングさせる
  useEffect(() => {
    setTimeout(() => setState(!state), 1000 * 60); // 60秒
  }, [state]);

  return (
    <aside className="flex flex-col gap-4">
      <div className="p-4 rounded border">
        <h3>{isStartedNewsShare(dayjs()) ? "ニュースシェア中" : "ニュースを共有してみよう"}</h3>
        <p>{dayjs().format("HH:mm")}</p>
      </div>

      <h3 className="p-4 text-lg rounded border">
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

        <p className="text-sm">
          明日シェア予定のニュースの件数を表示
          アーカイブへのリンクも設置するのと、アーカイブはクエリパラメーターをつける
        </p>
      </h3>

      <div className="p-4 rounded border">延期済みのニュースを見れるようにする</div>

      <div className="p-4 rounded border">Twitterで探す→的な？</div>
    </aside>
  );
};

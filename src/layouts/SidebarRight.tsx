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
        <p className="text-sm font-bold">{dayjs().format("MM/DD（ddd）")}</p>
        <p
          className={`font-bold text-3xl ${isStartedNewsShare(dayjs()) ? "text-emerald-400" : ""}`}
        >
          {dayjs().format("HH : mm")}
        </p>
        <p>
          <span className="text-xl font-bold">{data?.newsList.length}</span>件のニュース
        </p>
      </div>

      <p className="p-4 text-sm rounded border">
        TODO:
        拡張機能でDOM経由でoViceのチャットを拾い、このAPIに投げて複製、表示する。しまぶーさんのみリクエストできるようにする？API側でチャットのリクエストは拡張機能からしか受け付けないようにする
      </p>

      <p className="p-4 text-sm rounded border">
        明日シェア予定のニュースの件数を表示
        アーカイブへのリンクも設置するのと、アーカイブはクエリパラメーターをつける
      </p>

      <div className="p-4 rounded border">延期済みのニュースを見れるようにする</div>

      <div className="p-4 rounded border">Twitterで探す→的な？</div>
    </aside>
  );
};

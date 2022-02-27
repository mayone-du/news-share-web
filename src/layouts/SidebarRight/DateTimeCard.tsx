import dayjs from "dayjs";
import { useEffect, useState, VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat, isStartedNewsShare } from "src/utils";

// TODO: コンポーネント分割
export const DateTimeCard: VFC = () => {
  const { data } = useNewsListQuery({
    variables: { input: { sharedAt: dayjs().format(hyphenFormat) } },
    fetchPolicy: "cache-only",
  });
  const [state, setState] = useState(false);

  // 1分毎に再レンダリングさせる
  useEffect(() => {
    setTimeout(() => setState(!state), 1000 * 60); // 60秒
  }, [state]);

  return (
    <div className="p-4 rounded border">
      <p className="text-sm font-bold">{dayjs().format("MM/DD（ddd）")}</p>
      <p className={`font-bold text-3xl ${isStartedNewsShare(dayjs()) ? "text-emerald-400" : ""}`}>
        {dayjs().format("HH : mm")}
      </p>
      <p>
        <span className="text-xl font-bold">{data?.newsList.length}</span>件のニュース
      </p>
    </div>
  );
};

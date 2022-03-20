import dayjs from "dayjs";
import { useEffect, useState, VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat, isStartedNewsShare } from "src/utils";
// TODO: Tooltipで時間の説明
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Tooltip } from "src/components/common/Tooltip";

export const DateTimeCard: VFC = () => {
  // TODO: ニュースが取得できない場合のことなどもあるので、色々考える errorPolicyとか？
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
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-bold">{dayjs().format("MM/DD（ddd）")}</p>
        <p
          className={`font-bold text-3xl ${isStartedNewsShare(dayjs()) ? "text-emerald-400" : ""}`}
        >
          {dayjs().format("HH : mm")}
        </p>
        <div>
          {data?.newsList.length ? (
            <p>
              <span className="text-xl font-bold">{data?.newsList.length}</span>
              件のニュース
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
      <div>
        <Tooltip tooltipText={`毎日 22:45 ~ ニュースシェアが開催されます`}>
          <AiOutlineQuestionCircle />
        </Tooltip>
      </div>
    </div>
  );
};

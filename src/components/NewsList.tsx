import dayjs from "dayjs";
import { VFC } from "react";
import { useNewsListQuery, useTestQuery } from "src/graphql/schemas/generated/schema";

export const NewsList: VFC = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: today } },
    // pollInterval: 1000 * 100, // mill secondなのでこの場合は10秒ごとにポーリング
  });
  console.log("render NewsList");

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <ul>
      {/* {data?.test} */}
      {data?.newsList?.map((news) => {
        return (
          <li key={news.nodeId} className="overflow-hidden rounded border">
            <a href={news.url} className="block py-2 px-4">
              <h3 className="text-lg font-bold">{news.title}</h3>
              <p className="text-sm text-gray-400">{news.description}</p>
              <div className="flex items-center">
                <span className="text-xs text-gray-600">{news.user.nickname}</span>
                <span className="text-xs text-gray-600">
                  {/* TODO: 何分前とか表示 */}
                  {dayjs(news.sharedAt).format("YYYY-MM-DD")}
                </span>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

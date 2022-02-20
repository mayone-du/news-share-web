import dayjs from "dayjs";
import { VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat } from "src/utils";

export const NewsList: VFC = () => {
  const today = dayjs().format(hyphenFormat);
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: today } },
    pollInterval: 1000 * 10, // mill secondなのでこの場合は10秒ごとにポーリング
  });

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  if (data?.newsList.length === 0) return <div>ニュースはまだありません</div>;

  return (
    <ul>
      {data?.newsList.map((news) => {
        return (
          <li
            key={news.nodeId}
            className="overflow-hidden mb-4 rounded border"
            title={news.title || news.description || news.url}
          >
            <a
              href={news.url}
              className="flex items-center justify-between py-2 px-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="pr-2">
                <h3 className="text-lg font-bold line-clamp-1">{news.title || news.url}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{news.description}</p>
                <div className="flex items-center">
                  <span className="text-xs text-gray-600">{news.user.displayName}</span>
                  <span className="text-xs text-gray-600">
                    {/* TODO: 何分前とか表示 */}
                    {dayjs(news.createdAt).format(hyphenFormat)}
                  </span>
                </div>
              </div>
              {news.imageUrl ? (
                <img
                  src={news.imageUrl}
                  alt={news.title || news.description || news.url}
                  className="block w-20 h-20 object-cover rounded-md border border-gray-100"
                />
              ) : (
                <div className="w-20 h-20" />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

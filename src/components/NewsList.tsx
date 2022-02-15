import dayjs from "dayjs";
import { VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";

export const NewsList: VFC = () => {
  const today = dayjs();
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: today.toString() } },
  });
  console.log("data", data);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <ul>
      {data?.newsList?.map((news) => {
        return (
          <li key={news.id} className="overflow-hidden rounded border">
            <a href={news.url} className="block p-2">
              <h3 className="text-lg font-bold">{news.title}</h3>
              <p className="text-sm text-gray-400">{news.description}</p>
              <span className="text-xs text-gray-600">{news.createdAt}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

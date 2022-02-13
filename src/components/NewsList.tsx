import dayjs from "dayjs";
import { VFC } from "react";
import { useNewsListQuery } from "src/graphql/schemas/generated/schema";

export const NewsList: VFC = () => {
  const today = dayjs();
  const { data, loading, error } = useNewsListQuery({
    variables: { input: { sharedAt: today } },
  });
  console.log("data", data);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <ul>
      {data?.newsList?.map((news) => {
        return (
          <li key={news.id}>
            <a href={news.url}>{news.title}</a>
          </li>
        );
      })}
    </ul>
  );
};

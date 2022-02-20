import dayjs from "dayjs";
import { VFC } from "react";
import { Role, useMyUserInfoQuery, useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { hyphenFormat } from "src/utils";
import { BiChevronDown } from "react-icons/bi";
import { Popover } from "@headlessui/react";

export const NewsList: VFC = () => {
  const today = dayjs().format(hyphenFormat);
  const {
    data: NewsListData,
    loading,
    error,
  } = useNewsListQuery({
    variables: { input: { sharedAt: today } },
    pollInterval: 1000 * 10, // mill secondなのでこの場合は10秒ごとにポーリング
  });

  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" });

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  if (NewsListData?.newsList.length === 0) return <div>ニュースはまだありません</div>;

  return (
    <ul>
      {NewsListData?.newsList.map((news) => {
        return (
          <li
            key={news.nodeId}
            className="overflow-hidden relative mb-4 rounded border"
            title={news.title || news.description || news.url}
          >
            {/* 管理者か自分の投稿したニュースであれば、ニュースに対してのメニュー表示 */}
            {myUserInfoData?.myUserInfo?.role === Role.Admin ||
              (news.user.id === myUserInfoData?.myUserInfo?.id && (
                <Popover>
                  {({ open }) => {
                    return (
                      <div>
                        <Popover.Button
                          className={`items-center absolute top-2 right-2 justify-center p-1 overflow-hidden rounded-full flex hover:bg-gray-200 ${
                            open && "bg-gray-200"
                          }`}
                        >
                          <BiChevronDown className="w-6 h-6 text-gray-600" />
                        </Popover.Button>
                        <Popover.Panel className="absolute right-0 top-10 mt-4 w-72 bg-white rounded border shadow-md transform dark:bg-black">
                          <ul>
                            <li>編集する</li>
                          </ul>
                        </Popover.Panel>
                      </div>
                    );
                  }}
                </Popover>
              ))}
            <a
              href={news.url}
              className="block py-3 px-8 hover:bg-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="">
                <h3 className="text-lg font-bold line-clamp-1">{news.title || news.url}</h3>

                <div className="flex items-center">
                  <p className="my-2 mr-4 text-sm text-gray-400 line-clamp-2">{news.description}</p>
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title || news.description || news.url}
                      className="block object-cover w-16 h-16 rounded-md border border-gray-100"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-600">{news.user.displayName}</span>
                  <span className="text-xs text-gray-600">
                    {/* TODO: 何分前とか表示 */}
                    {dayjs(news.createdAt).format(hyphenFormat)}
                  </span>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

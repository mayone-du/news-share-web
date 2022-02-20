import dayjs from "dayjs";
import { VFC } from "react";
import { Role, useMyUserInfoQuery, useNewsListQuery } from "src/graphql/schemas/generated/schema";
import { calcFromNow, hyphenFormat } from "src/utils";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineClockCircle, AiOutlineEdit } from "react-icons/ai";
import { Popover } from "@headlessui/react";
import type { IconType } from "react-icons";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";

const NEWS_OPERATION_MENU_LIST: { label: string; Icon: IconType }[] = [
  { label: "編集する", Icon: AiOutlineEdit },
];

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
            className="relative mb-4 rounded border"
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
                          className={`items-center absolute top-2 right-2 justify-center p-1 rounded-full flex hover:bg-gray-200 ${
                            open && "bg-gray-200"
                          }`}
                        >
                          <BiChevronDown className="w-6 h-6 text-gray-600" />
                        </Popover.Button>
                        <Popover.Panel className="absolute -right-4 z-10 top-10 mt-4 w-72 bg-white rounded border shadow-md transform dark:bg-black">
                          <ul>
                            <li className="p-2 flex items-center text-gray-600">
                              <HiOutlinePencil className="w-5 h-5 mr-4 text-gray-600" />
                              編集する
                            </li>
                            <li className="p-2 flex items-center text-red-500 border-gray-100">
                              <RiDeleteBinLine className="w-5 h-5 mr-4 text-red-500" />
                              削除する
                            </li>
                          </ul>
                        </Popover.Panel>
                      </div>
                    );
                  }}
                </Popover>
              ))}

            {/* コンテンツ */}
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
                  {news.user.photoUrl ? (
                    <img
                      src={news.user.photoUrl}
                      alt={news.user.displayName}
                      className="w-6 h-6 mr-1 rounded-full border border-gray-100"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="text-sm text-gray-600 font-bold mr-4">
                    {news.user.displayName}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <AiOutlineClockCircle className="w-4 h-4 mr-1" />
                    {calcFromNow(news.createdAt)}
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

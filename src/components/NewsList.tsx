import dayjs from "dayjs";
import { VFC } from "react";
import {
  Role,
  useDeleteNewsMutation,
  useMyUserInfoQuery,
  useNewsListQuery,
} from "src/graphql/schemas/generated/schema";
import { calcFromNow, hyphenFormat } from "src/utils";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Popover } from "@headlessui/react";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from "react-hot-toast";

export const NewsList: VFC = () => {
  const today = dayjs().format(hyphenFormat);
  const {
    data: NewsListData,
    loading,
    error,
    refetch,
  } = useNewsListQuery({
    variables: { input: { sharedAt: today } },
    // pollInterval: 1000 * 5, // mill secondなのでこの場合は5秒ごとにポーリング
  });

  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" }); // layoutで取得してるのでcache-onlyでネットワークリクエストを抑える
  const [deleteNews, { loading: isDeleteNewsLoading }] = useDeleteNewsMutation();
  const handleDeleteNews = (nodeId: string, onClose: VoidFunction) => {
    return async () => {
      const toastId = toast.loading("ニュースを削除しています...");
      try {
        await deleteNews({ variables: { input: { nodeId } } });
        onClose();
        await refetch();
        toast.success("ニュースを削除しました", { id: toastId });
      } catch (e) {
        console.error(e);
        toast.error("ニュースの削除に失敗しました", { id: toastId });
      }
    };
  };

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
                  {({ open, close }) => {
                    return (
                      <div>
                        <Popover.Button
                          className={`items-center absolute top-2 right-2 justify-center p-1 rounded-full flex hover:bg-gray-200 border border-transparent hover:border-gray-50 ${
                            open && "bg-gray-200"
                          }`}
                        >
                          <BiChevronDown className="w-6 h-6 text-gray-600" />
                        </Popover.Button>
                        <Popover.Panel className="absolute -right-4 top-10 z-10 mt-4 w-72 bg-white rounded border shadow-md transform dark:bg-black">
                          <ul>
                            <li>
                              <button
                                className="flex items-start p-2 w-full text-gray-600 hover:bg-gray-100"
                                onClick={() => alert("developing...")}
                              >
                                <HiOutlinePencil className="mr-4 w-5 h-5 text-gray-600" />
                                編集する
                              </button>
                            </li>
                            <li>
                              <button
                                className="flex items-start p-2 w-full text-red-500 hover:bg-gray-100 disabled:bg-gray-200"
                                onClick={handleDeleteNews(news.nodeId ?? "", close)}
                                disabled={isDeleteNewsLoading}
                              >
                                <RiDeleteBinLine className="mr-4 w-5 h-5 text-red-500" />
                                削除する
                              </button>
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
                      className="mr-1 w-6 h-6 rounded-full border border-gray-100"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="mr-4 text-sm font-bold text-gray-600">
                    {news.user.displayName}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <AiOutlineClockCircle className="mr-1 w-4 h-4" />
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

import type { VFC } from "react";
import { DateTimeCard } from "src/layouts/SidebarRight/DateTimeCard";
import { SearchFormCard } from "src/layouts/SidebarRight/SearchFormCard";

// TODO: 各コンポーネント自体には余白やborderをつけず、ここで配列に格納しmapでdivで多いながらスタイリングして出力
export const SidebarRight: VFC = () => {
  return (
    <aside className="flex flex-col gap-4">
      <DateTimeCard />

      <SearchFormCard />

      <p className="p-4 text-sm rounded border">
        TODO:
        カレンダーとか検索用UI表示して、検索用ページは削除する。クエリパラメーターつけてもいいかも
      </p>

      <p className="p-4 text-sm rounded border">
        TODO:
        拡張機能でDOM経由でoViceのチャットを拾い、このAPIに投げて複製、表示する。しまぶーさんのみリクエストできるようにする？API側でチャットのリクエストは拡張機能からしか受け付けないようにする。
        懸念事項としては、メッセージが重複してしまうことや、チャット欄を閉じた状態でDOMにアクセスできるのか、などなど
        拡張機能からoViceにどうにかリクエストなげてチャットを取得できるなら、それでフィルタリングするなどしてフロントのAPIルートで受け取るとかでもいいかも
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

import type { VFC } from "react";
import { DateTimeCard } from "src/layouts/SidebarRight/DateTimeCard";
import { SearchFormCard } from "src/layouts/SidebarRight/SearchFormCard";

// TODO: 各コンポーネント自体には余白やborderをつけず、ここで配列に格納しmapでdivで多いながらスタイリングして出力
export const SidebarRight: VFC = () => {
  return (
    <aside className="flex flex-col gap-4">
      <DateTimeCard />

      <SearchFormCard />

      <ul className="list-disc rounded border text-sm text-gray-600 pl-8 py-4 pr-4">
        <h4 className="font-bold text-sm text-gray-700">TODO:</h4>
        <li>拡張機能でDOM経由でoViceのチャットを拾い、このAPIに投げて複製、表示</li>
        <li>しまぶーさんのみ、拡張機能からリクエストできる。API側でもバリデーション</li>
        <li>
          懸念事項としては、メッセージが重複してしまうことや、チャット欄を閉じた状態でDOMにアクセスできるのか、などなど
        </li>
        <li>
          拡張機能からoViceにどうにかリクエストなげてチャットを取得できるなら、それでフィルタリングするなどしてフロントのAPIルートで受け取るとかでもいいかも
        </li>
      </ul>

      <div className="p-4 rounded border">Twitterで探す→的な？</div>
    </aside>
  );
};

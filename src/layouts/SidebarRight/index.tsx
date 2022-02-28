import type { VFC } from "react";
import { DateTimeCard } from "src/layouts/SidebarRight/DateTimeCard";
import { SearchFormCard } from "src/layouts/SidebarRight/SearchFormCard";

// TODO: 各コンポーネント自体には余白やborderをつけず、ここで配列に格納しmapでdivで多いながらスタイリングして出力
export const SidebarRight: VFC = () => {
  return (
    <aside className="flex flex-col gap-4">
      <DateTimeCard />
      <SearchFormCard />
    </aside>
  );
};

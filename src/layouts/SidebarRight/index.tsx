import type { VFC } from "react";
import { DateTimeCard } from "src/layouts/SidebarRight/DateTimeCard";
import { SearchFormCard } from "src/layouts/SidebarRight/SearchFormCard";

const SidebarRightContents = [DateTimeCard, SearchFormCard];

export const SidebarRight: VFC = () => {
  return (
    <aside className="flex flex-col gap-4">
      {SidebarRightContents.map((Component, i) => {
        return (
          <div className="p-4 rounded border dark:bg-zinc-700" key={i}>
            <Component />
          </div>
        );
      })}
    </aside>
  );
};

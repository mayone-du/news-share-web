import { Box } from "@mantine/core";
import type { VFC } from "react";
import { DateTimeCard } from "src/layouts/SidebarRight/DateTimeCard";
import { SearchFormCard } from "src/layouts/SidebarRight/SearchFormCard";

const SidebarRightContents = [DateTimeCard, SearchFormCard];

export const SidebarRight: VFC = () => {
  return (
    <Box className="flex flex-col gap-4">
      {SidebarRightContents.map((Component, i) => {
        return (
          <Box className="p-4 bg-white rounded border" key={i}>
            <Component />
          </Box>
        );
      })}
    </Box>
  );
};

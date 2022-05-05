import { Box } from "@mantine/core";
import type { VFC } from "react";
import { DateTimeCard } from "src/layouts/SidebarRight/DateTimeCard";
import { SearchByCalendar } from "src/layouts/SidebarRight/SearchByCalendar";
import { SearchByText } from "src/layouts/SidebarRight/SearchByText";

const SidebarRightContents = [DateTimeCard, SearchByText, SearchByCalendar];

export const SidebarRight: VFC = () => {
  return (
    <Box className="flex flex-col gap-4">
      {SidebarRightContents.map((Component, i) => {
        return (
          <Box className="p-4 rounded border bg-white" key={i}>
            <Component />
          </Box>
        );
      })}
    </Box>
  );
};

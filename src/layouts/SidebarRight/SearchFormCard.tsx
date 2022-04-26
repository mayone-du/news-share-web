import { Box } from "@mantine/core";
import { useState, VFC } from "react";
import { Calendar } from "@mantine/dates";
import "dayjs/locale/ja";

export const SearchFormCard: VFC = () => {
  const [value, setValue] = useState(new Date());
  return (
    <Box>
      <Calendar
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
        className="mx-auto"
        locale="ja"
      />
    </Box>
  );
};

import { Box } from "@mantine/core";
import { useState, VFC } from "react";
import { Calendar } from "@mantine/dates";
import "dayjs/locale/ja";

export const SearchFormCard: VFC = () => {
  const [value, setValue] = useState(new Date());
  const handleChangeDate = (value: Date) => {
    setValue(value);
  };
  return (
    <Box>
      <Calendar value={value} onChange={handleChangeDate} className="mx-auto" locale="ja" />
    </Box>
  );
};

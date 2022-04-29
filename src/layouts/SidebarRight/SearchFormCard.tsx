import { Box, Stack, Title } from "@mantine/core";
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
      <Stack spacing={"sm"}>
        <Title order={5}>ニュースを検索</Title>
        <Calendar value={value} onChange={handleChangeDate} className="mx-auto" locale="ja" />
      </Stack>
    </Box>
  );
};

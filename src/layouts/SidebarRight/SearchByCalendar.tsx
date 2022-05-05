import { Box, Stack, TextInput, Title } from "@mantine/core";
import { useCallback, useState, VFC } from "react";
import { Calendar } from "@mantine/dates";
import "dayjs/locale/ja";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { hyphenFormat } from "src/utils";

export const SearchByCalendar: VFC = () => {
  const { query, push, isReady } = useRouter();
  if (!isReady) return null;
  const date = query.date?.toString() ? new Date(query.date?.toString()) : new Date();
  const [value, setValue] = useState(date);

  const handleChangeDate = useCallback((value: Date) => {
    setValue(value);
    query["date"] = dayjs(value).format(hyphenFormat);
    push({ query });
  }, []);

  return (
    <Box>
      <Stack spacing={"sm"}>
        <Title order={5}>日付で検索</Title>
        <Calendar value={value} onChange={handleChangeDate} className="mx-auto" locale="ja" />
      </Stack>
    </Box>
  );
};

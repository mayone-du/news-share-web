import { Box, Stack, Title } from "@mantine/core";
import { useCallback, useState, VFC } from "react";
import { Calendar } from "@mantine/dates";
import "dayjs/locale/ja";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { hyphenFormat } from "src/utils";

export const SearchFormCard: VFC = () => {
  const { query, push } = useRouter();
  const [value, setValue] = useState(new Date());

  const handleChangeDate = useCallback((value: Date) => {
    setValue(value);
    query["date"] = dayjs(value).format(hyphenFormat);
    push({ query });
  }, []);

  return (
    <Box>
      <Stack spacing={"sm"}>
        <Title order={5}>ニュースを検索</Title>
        <Calendar value={value} onChange={handleChangeDate} className="mx-auto" locale="ja" />
      </Stack>
    </Box>
  );
};

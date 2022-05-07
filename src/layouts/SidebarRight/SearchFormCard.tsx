import { Button, Select, Box, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { News } from "src/graphql/schemas/generated/schema";
import { useCallback, useState, VFC } from "react";
import { Calendar } from "@mantine/dates";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { hyphenFormat } from "src/utils";
import "dayjs/locale/ja";

const SEARCHABLE_FIELDS: Record<
  keyof Pick<News, "url" | "title" | "description" | "sharedAt">,
  string
> = {
  url: "URL",
  title: "タイトル",
  description: "説明",
  sharedAt: "日付",
} as const;

type FieldValues = { keyword: string };

export const SearchFormCard: VFC = () => {
  const { query, push } = useRouter();
  const defaultDate = query.sharedAt?.toString()
    ? new Date(query.sharedAt?.toString())
    : new Date();
  const [searchDate, setSearchDate] = useState(defaultDate);
  const [searchField, setSearchField] = useState<keyof typeof SEARCHABLE_FIELDS>("title");
  const { onSubmit, getInputProps, clearErrors } = useForm<FieldValues>({
    initialValues: { keyword: "" },
    validate: {
      keyword: (value) => {
        if (searchField !== "sharedAt" && value === "") return "キーワードを入力してください";
      },
    },
  });

  const handleChangeDate = useCallback((value: Date) => {
    setSearchDate(value);
  }, []);

  const handleChangeSelect = useCallback((value: keyof typeof SEARCHABLE_FIELDS) => {
    setSearchField(value);
  }, []);

  const handleSubmit = onSubmit(async (data) => {
    if (searchField === "sharedAt") {
      query[searchField] = dayjs(searchDate).format(hyphenFormat);
      push({ pathname: "/", query });
      return;
    }
    query[searchField] = data.keyword;
    push({ pathname: "/", query });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={"sm"}>
        <div className="flex items-center gap-1">
          <Select
            value={searchField}
            onChange={handleChangeSelect}
            className="w-2/5"
            data={Object.entries(SEARCHABLE_FIELDS).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            placeholder="検索する条件"
          />
          <Title order={5}>で検索</Title>
        </div>
        {searchField === "sharedAt" ? (
          <Calendar
            value={searchDate}
            onChange={handleChangeDate}
            className="mx-auto"
            locale="ja"
          />
        ) : (
          <TextInput label="検索したいキーワードを入力" {...getInputProps("keyword")} />
        )}
        <Button type="submit">検索</Button>
      </Stack>
    </form>
  );
};

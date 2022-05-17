import { Button, Select, Box, Stack, TextInput, Title, ActionIcon, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { News } from "src/graphql/schemas/generated/schema";
import { useCallback, useState, VFC } from "react";
import { Calendar } from "@mantine/dates";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { hyphenFormat } from "src/utils";
import "dayjs/locale/ja";
import { QUERY_PARAM_LABELS } from "src/constants";
import { IoReload } from "react-icons/io5";

type FieldValues = { keyword: string };

export const SearchFormCard: VFC = () => {
  const { query, push } = useRouter();
  const defaultDate = query.sharedAt?.toString()
    ? new Date(query.sharedAt?.toString())
    : new Date();
  const [searchDate, setSearchDate] = useState(defaultDate);
  const [searchField, setSearchField] = useState<keyof typeof QUERY_PARAM_LABELS>("title");
  const { onSubmit, getInputProps } = useForm<FieldValues>({
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

  const handleChangeSelect = useCallback((value: keyof typeof QUERY_PARAM_LABELS) => {
    setSearchField(value);
  }, []);

  const handleReset = useCallback(() => push("/"), []);

  const removeQueryParams = (ignoreParam: keyof typeof QUERY_PARAM_LABELS) => {
    Object.keys(QUERY_PARAM_LABELS).forEach((key) => {
      if (key !== ignoreParam) delete query[key];
    });
  };

  const handleSubmit = onSubmit(async (data) => {
    removeQueryParams(searchField);
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
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <Select
              value={searchField}
              onChange={handleChangeSelect}
              className="w-2/5"
              data={Object.entries(QUERY_PARAM_LABELS).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
              placeholder="検索する条件"
            />
            <Title order={5}>で検索</Title>
          </div>
          <Tooltip label="検索条件をリセット">
            <ActionIcon className="rounded-full" onClick={handleReset}>
              <IoReload />
            </ActionIcon>
          </Tooltip>
        </div>
        {searchField === "sharedAt" ? (
          <Calendar
            value={searchDate}
            onChange={handleChangeDate}
            className="mx-auto"
            locale="ja"
          />
        ) : (
          <TextInput
            label="検索したいキーワードを入力"
            placeholder="React..."
            {...getInputProps("keyword")}
          />
        )}
        <Button type="submit">検索</Button>
      </Stack>
    </form>
  );
};

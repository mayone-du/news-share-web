import { Button, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState, VFC } from "react";
import { News } from "src/graphql/schemas/generated/schema";

const SEARCHABLE_FIELDS: Record<keyof Pick<News, "url" | "title" | "description">, string> = {
  url: "URL",
  title: "タイトル",
  description: "説明",
} as const;

type FieldValues = { keyword: string };

export const SearchByText: VFC = () => {
  const { onSubmit, getInputProps } = useForm<FieldValues>({
    initialValues: { keyword: "" },
  });
  const [searchField, setSearchField] = useState<keyof typeof SEARCHABLE_FIELDS>("title");

  const handleChangeSelect = (value: keyof typeof SEARCHABLE_FIELDS) => {
    setSearchField(value);
    console.log(value);
  };
  console.log(searchField);

  const handleSubmit = onSubmit(async (data) => {
    console.log(data);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={"sm"}>
        <div className="flex items-center">
          <Select
            value={searchField}
            onChange={handleChangeSelect}
            className="w-2/5"
            data={Object.values(SEARCHABLE_FIELDS)}
          />
          <Title order={5}>で検索</Title>
        </div>
        <TextInput label="検索したいキーワードを入力" {...getInputProps} />
        <Button type="submit">検索</Button>
      </Stack>
    </form>
  );
};

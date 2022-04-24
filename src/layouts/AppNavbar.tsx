import { VFC } from "react";
import { Navbar, UnstyledButton, Avatar, Group, Text } from "@mantine/core";
import { AiOutlineHome } from "react-icons/ai";

import NextLink from "next/link";

export const AppNavbar: VFC = () => {
  return (
    <Navbar width={{ base: 300 }} height={500} p="xs">
      <NextLink href="/" passHref>
        <UnstyledButton component="a" className="rounded hover:bg-gray-200 transition-colors">
          <Group>
            <Avatar size={32} className="m-1">
              <AiOutlineHome size={20} />
            </Avatar>
            <Text size="xs" color="gray">
              ホーム
            </Text>
          </Group>
        </UnstyledButton>
      </NextLink>
    </Navbar>
  );
};

import { BiSun, BiMoon } from "react-icons/bi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { STATIC_ROUTES } from "src/constants/routes";
import { useAuthModal } from "src/hooks/useAuthModal";
import type { VFC } from "react";
import { Role, useMyUserInfoQuery } from "src/graphql/schemas/generated/schema";
import { FiLogOut } from "react-icons/fi";
import {
  Avatar,
  Button,
  UnstyledButton,
  Header,
  ActionIcon,
  useMantineColorScheme,
  Menu,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdAccountCircle } from "react-icons/md";
import NextLink from "next/link";

export const AppHeader: VFC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const handleToggleColorScheme = () => toggleColorScheme();
  const isDark = colorScheme === "dark";

  const { data: session, status } = useSession();
  const { data: myUserInfoData } = useMyUserInfoQuery({ fetchPolicy: "cache-only" });
  const { handleOpenAuthModal } = useAuthModal();

  const [opened, { open, close }] = useDisclosure(false);

  const handleSignOut = useCallback(() => signOut(), []);
  return (
    <Header height={60} px="xl" py="xs" className="flex items-center justify-end gap-6">
      {status === "loading" && (
        <div className="ml-2 w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
      )}
      {status === "unauthenticated" && <Button onClick={handleOpenAuthModal}>SignIn</Button>}
      {status === "authenticated" && myUserInfoData?.myUserInfo && (
        <Menu
          opened={opened}
          onClose={close}
          position="bottom"
          control={
            <UnstyledButton
              onClick={open}
              className={`block rounded-full ${opened ? "ring-2 ring-blue-300" : ""}`}
            >
              <Avatar
                size={32}
                src={myUserInfoData.myUserInfo.photoUrl}
                alt={myUserInfoData.myUserInfo.displayName}
                radius="xl"
              />
            </UnstyledButton>
          }
        >
          <Menu.Label>
            {myUserInfoData.myUserInfo.role === Role.Admin && "👑"}
            {myUserInfoData.myUserInfo.role === Role.Developer && "💻"}
            {myUserInfoData.myUserInfo.displayName}
          </Menu.Label>
          <NextLink href={`user/${myUserInfoData.myUserInfo.oauthUserId}`} passHref>
            <Menu.Item
              component="a"
              icon={<MdAccountCircle size={16} />}
              className="hover:bg-gray-100"
            >
              マイページ
            </Menu.Item>
          </NextLink>
          <Divider />
          <Menu.Item
            onClick={handleSignOut}
            icon={<FiLogOut size={16} />}
            className="hover:bg-gray-100"
          >
            ログアウト
          </Menu.Item>
        </Menu>
      )}
      <ActionIcon variant="outline" onClick={handleToggleColorScheme} title="テーマカラーを変更">
        {isDark ? <BiSun size={18} /> : <BiMoon size={18} />}
      </ActionIcon>
    </Header>
  );
};

import type { ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

// wip
export const useColorTheme = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  // TODO: html要素のclassNameとかを更新してtailwindに反応させる

  return {
    colorScheme,
    toggleColorScheme,
  };
};

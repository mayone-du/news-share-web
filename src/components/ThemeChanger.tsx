import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import type { VFC } from "react";
import { memo, useCallback } from "react";

export const ThemeChanger: VFC = memo(() => {
  const { theme, setTheme } = useTheme();
  const handleChangeTheme = useCallback(() => {
    return theme === "light" ? setTheme("dark") : setTheme("light");
  }, [theme, setTheme]);

  return (
    <Switch
      checked={theme === "light"}
      onChange={handleChangeTheme}
      className={`${theme === "light" ? "bg-teal-900" : "bg-teal-700"}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-gray-400 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${theme === "light" ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
      />
    </Switch>
  );
});

ThemeChanger.displayName = "ThemeChanger";

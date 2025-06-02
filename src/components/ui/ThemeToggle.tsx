import { useColorMode } from "@kobalte/core";

import FaRegularSun from "~icons/fa-regular/sun";
import FaRegularMoon from "~icons/fa-regular/moon";
import MaterialSymbolsLaptopWindowsOutlineRounded from "~icons/material-symbols/laptop-windows-outline-rounded";

import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";

export function ThemeToggle() {
  const { setColorMode } = useColorMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button<"button">} variant="ghost" size="sm" class="w-9 px-0">
        <FaRegularSun class="size-6 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <FaRegularMoon class="absolute size-6 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span class="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setColorMode("light")}>
          <FaRegularSun class="mr-2 size-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("dark")}>
          <FaRegularMoon class="mr-2 size-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("system")}>
          <MaterialSymbolsLaptopWindowsOutlineRounded class="mr-2 size-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

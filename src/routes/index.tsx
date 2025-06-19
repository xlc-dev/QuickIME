import { MetaProvider, Title } from "@solidjs/meta";
import { Show } from "solid-js";

import { createStorageSignal } from "~/storage";

import { ThemeToggle } from "~/components/ui/ThemeToggle";
import { Flex } from "~/components/ui/Flex";
import { IMEField } from "~/components/IMEField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import { Label } from "~/components/ui/Label";
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/Switch";

export default function Home() {
  const [showTitle, setShowTitle] = createStorageSignal("setting-show-title", true);
  const [showExplanation, setShowExplanation] = createStorageSignal(
    "setting-show-explanation",
    true
  );

  return (
    <MetaProvider>
      <Title>QuickIME – An Input Method Editor that doesn't suck</Title>
      <Flex
        flexDirection="col"
        justifyContent="start"
        alignItems="center"
        class="bg-background text-foreground relative min-h-screen pt-[20vh]">
        <Dialog>
          <Flex flexDirection="col" alignItems="center" class="w-full max-w-2xl gap-4 px-4">
            <div class="text-center">
              <Show when={showTitle()}>
                <h1 class="text-3xl font-semibold sm:text-4xl">
                  QuickIME – An Input Method Editor that{" "}
                  <span class="text-primary">doesn't suck</span>
                </h1>
              </Show>

              <Show when={showExplanation()}>
                <p class="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
                  Tired of clunky setups, invasive tracking, and unreliable input methods? IME is a
                  fast, private, and simple web-based alternative that just works.
                </p>
              </Show>
            </div>

            <IMEField />

            <footer class="text-muted-foreground text-sm">
              <Flex alignItems="center" class="gap-3">
                <span>
                  Made by{" "}
                  <a
                    href="https://github.com/xlc-dev"
                    class="text-foreground font-bold hover:underline">
                    xlcdev
                  </a>
                </span>
                <span>·</span>
                <a
                  href="https://github.com/xlc-dev/IME"
                  class="text-foreground font-bold hover:underline">
                  GitHub
                </a>
                <span>·</span>
                <DialogTrigger
                  as="button"
                  class="text-foreground cursor-pointer font-bold hover:underline">
                  Settings
                </DialogTrigger>
              </Flex>
            </footer>
          </Flex>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Customize your experience. Changes are saved automatically.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <Switch
                checked={showTitle()}
                onChange={setShowTitle}
                id="show-title"
                class="flex w-full items-center justify-between">
                <SwitchLabel>Show Title</SwitchLabel>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
              </Switch>

              <Switch
                checked={showExplanation()}
                onChange={setShowExplanation}
                id="show-explanation"
                class="flex w-full items-center justify-between">
                <SwitchLabel>Show Explanation</SwitchLabel>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
              </Switch>

              <Flex justifyContent="between" alignItems="center">
                <Label>Theme</Label>
                <ThemeToggle />
              </Flex>
            </div>
          </DialogContent>
        </Dialog>
      </Flex>
    </MetaProvider>
  );
}

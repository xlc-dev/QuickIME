import { MetaProvider, Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";

import { ThemeToggle } from "~/components/ui/ThemeToggle";
import { Flex } from "~/components/ui/Flex";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/Dialog";
import { Label } from "~/components/ui/Label";
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/Switch";

import { IMEField } from "~/components/IMEField";

const Info = clientOnly(() => import("../components/Info"));
import { createStorageSignal } from "~/utils";

export default function Home() {
  const [showTitle, setShowTitle] = createStorageSignal("setting-show-title", true);
  const [showExplanation, setShowExplanation] = createStorageSignal(
    "setting-show-explanation",
    true
  );

  return (
    <>
      <MetaProvider>
        <Title>QuickIME – An Input Method Editor that doesn't suck</Title>
      </MetaProvider>

      <Flex
        flexDirection="col"
        justifyContent="start"
        alignItems="center"
        class="bg-background text-foreground pt-4 lg:pt-[20vh]">
        <div class="flex w-full max-w-2xl flex-col items-center gap-4 px-4">
          <div class="text-center">
            <Info showTitle={showTitle} showExplanation={showExplanation} />
          </div>

          <IMEField />

          <footer class="text-muted-foreground w-full text-sm">
            <Flex justifyContent="center" alignItems="center" class="gap-2">
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

              <Dialog>
                <DialogTrigger
                  as="button"
                  class="text-foreground cursor-pointer font-bold hover:underline">
                  Settings
                </DialogTrigger>
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

              <span>·</span>

              <Dialog>
                <DialogTrigger
                  as="button"
                  class="text-foreground cursor-pointer font-bold hover:underline">
                  Tutorial
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tutorial</DialogTitle>
                    <DialogDescription>
                      This is a quick tutorial of how to use QuickIME. For now, only Japanese is
                      supported.
                    </DialogDescription>
                  </DialogHeader>
                  <div class="space-y-4 py-2">
                    <p>
                      You can select the input field and start typing, shocker. But once you have
                      typed something, QuickIME comes with a few handy features:
                    </p>
                    <ul class="list-disc space-y-4">
                      <li>
                        Press space to call jisho.org to get kanji/kana suggestions. in which you
                        can:
                        <ul class="list-inside list-disc">
                          <li>Go up or down with arrow keys or scroll</li>
                          <li>Press enter or click to select the suggestion</li>
                        </ul>
                      </li>
                      <li>
                        Press enter to confirm what you have typed, and don't want a kanji
                        suggestion for that portion of text
                      </li>
                      <li>
                        Backspaces are smart. It tries to unconfirm anything you did, else it will
                        remove the last character like normal
                      </li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </Flex>
          </footer>
        </div>
      </Flex>
    </>
  );
}

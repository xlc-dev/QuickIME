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
import { Grid } from "~/components/ui/Grid";

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
        <Flex flexDirection="col" alignItems="center" class="w-full max-w-2xl gap-4 px-4">
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
                  <Grid class="gap-4 py-4">
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
                  </Grid>
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
                    <DialogTitle>How to Use QuickIME</DialogTitle>
                    <DialogDescription>
                      Here's a quick guide to get you started with QuickIME. For now, only Japanese
                      is supported.
                    </DialogDescription>
                  </DialogHeader>
                  <div class="space-y-6 py-2 text-sm">
                    <div class="space-y-2">
                      <h3 class="font-semibold">1. Basic Typing</h3>
                      <p class="text-muted-foreground">
                        Just start typing in romaji. It will automatically be converted to hiragana
                        as you type.
                      </p>
                    </div>

                    <div class="space-y-2">
                      <h3 class="font-semibold">2. Converting to Kanji</h3>
                      <p class="text-muted-foreground">Once you have hiragana ready to convert:</p>
                      <ul class="text-muted-foreground list-inside list-disc space-y-2 pl-2">
                        <li>
                          <strong>On a Computer:</strong> Press the{" "}
                          <kbd class="bg-muted rounded-md border px-1.5 py-0.5 font-sans">
                            Spacebar
                          </kbd>
                          .
                        </li>
                        <li>
                          <strong>On Mobile:</strong> Tap the{" "}
                          <span class="border-primary/50 bg-primary/10 text-primary rounded-md border px-1.5 py-0.5 font-sans">
                            Convert
                          </span>{" "}
                          button.
                        </li>
                      </ul>
                      <p class="text-muted-foreground">
                        A list of suggestions will appear. Use your <strong>Arrow Keys</strong> or{" "}
                        <strong>scroll/tap</strong> to choose one, then press{" "}
                        <kbd class="bg-muted rounded-md border px-1.5 py-0.5 font-sans">Enter</kbd>{" "}
                        or <strong>click/tap</strong> to select it.
                      </p>
                    </div>

                    <div class="space-y-2">
                      <h3 class="font-semibold">3. Pro Tips</h3>
                      <ul class="text-muted-foreground list-inside list-disc space-y-2 pl-2">
                        <li>
                          <strong>Confirming Hiragana:</strong> Don't want to convert? Just press{" "}
                          <kbd class="bg-muted rounded-md border px-1.5 py-0.5 font-sans">
                            Enter
                          </kbd>{" "}
                          to confirm the text as-is.
                        </li>
                        <li>
                          <strong>Smart Backspace:</strong> The{" "}
                          <kbd class="bg-muted rounded-md border px-1.5 py-0.5 font-sans">
                            Backspace
                          </kbd>{" "}
                          key will undo your last conversion (e.g., changing 漢字 back to かんじ)
                          before it deletes characters.
                        </li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Flex>
          </footer>
        </Flex>
      </Flex>
    </>
  );
}

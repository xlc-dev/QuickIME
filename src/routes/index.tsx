import { MetaProvider, Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";

import { Button } from "~/components/ui/Button";
import { ThemeToggle } from "~/components/ui/ThemeToggle";

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <MetaProvider>
        <Title>IME</Title>
      </MetaProvider>

      <div class="mx-auto flex max-w-2xl flex-col items-center space-y-6 p-4">
        <Show when={import.meta.env.VITE_ENABLE_COLOR_MODE === "true"}>
          <ThemeToggle />
        </Show>
        <Button onClick={() => setCount(count() + 1)} class="w-fit">
          Clicked {count()} times
        </Button>
      </div>
    </>
  );
}

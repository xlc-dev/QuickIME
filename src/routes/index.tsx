import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";
import { createSignal, ErrorBoundary, Show } from "solid-js";

import { client } from "~/trpc-client";
import { Button } from "~/components/ui/Button";
import { ThemeToggle } from "~/components/ui/ThemeToggle";

const getGreeting = query(async () => {
  "use server";
  return await client.greeting.query();
}, "greeting");

export const route = {
  preload: () => {
    getGreeting().catch((err) => {
      console.error(err);
    });
  },
} satisfies RouteDefinition;

export default function Home() {
  const [count, setCount] = createSignal(0);

  const greeting = createAsync(() => getGreeting());

  return (
    <>
      <MetaProvider>
        <Title>solid-starter</Title>
      </MetaProvider>

      <div class="mx-auto max-w-2xl space-y-6 p-4 text-center">
        <Show when={import.meta.env.VITE_ENABLE_COLOR_MODE === "true"}>
          <ThemeToggle />
        </Show>
        <ErrorBoundary fallback={<div class="text-red-500">Failed to load greeting</div>}>
          <h1 class="text-2xl font-bold">{greeting()}</h1>
          <Button onClick={() => setCount(count() + 1)}>Clicked {count()} times</Button>
        </ErrorBoundary>
      </div>
    </>
  );
}

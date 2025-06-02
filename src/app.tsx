import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from "@kobalte/core";
import { Suspense, Show } from "solid-js";

import "./app.css";

const ENABLE_COLOR_MODE = import.meta.env.VITE_ENABLE_COLOR_MODE === "true";

export default function App() {
  let storageManager: ReturnType<typeof createLocalStorageManager>;

  if (ENABLE_COLOR_MODE) {
    storageManager = createLocalStorageManager("theme");
  }

  return (
    <Router
      root={(props) => (
        <Show when={ENABLE_COLOR_MODE} fallback={<Suspense>{props.children}</Suspense>}>
          <>
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
              <Suspense>{props.children}</Suspense>
            </ColorModeProvider>
          </>
        </Show>
      )}>
      <FileRoutes />
    </Router>
  );
}

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";
import { Suspense } from "solid-js";

import "./app.css";

export default function App() {
  const storageManager = createLocalStorageManager("theme");

  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <Suspense>
          <Router base={import.meta.env.SERVER_BASE_URL}>
            <FileRoutes />
          </Router>
        </Suspense>
      </ColorModeProvider>
    </>
  );
}

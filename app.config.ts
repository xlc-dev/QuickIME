import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error Errors for no reason cuz node doesn't find it?
import eslint from "vite-plugin-eslint";

export default defineConfig({
  middleware: "src/middleware.ts",
  vite: {
    plugins: [
      tailwindcss(),
      eslint({
        fix: true,
        cache: true,
      }),
    ],
  },
});

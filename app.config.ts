import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error Errors for no reason cuz node doesn't find it?
import eslint from "vite-plugin-eslint";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  appRoot: process.env.BASE_PATH,
  server: {
    baseURL: process.env.BASE_PATH,
    static: true,
    prerender: {
      failOnError: true,
      routes: ["/"],
      crawlLinks: true,
    },
  },
  vite: {
    plugins: [
      Icons({ compiler: "solid" }),
      tailwindcss(),
      eslint({
        fix: false,
        cache: true,
      }),
    ],
  },
});

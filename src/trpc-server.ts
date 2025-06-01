import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = ({ req, resHeaders }: FetchCreateContextFnOptions) => {
  return { req, resHeaders };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
const router = t.router;

export const appRouter = router({
  greeting: t.procedure.query(() => "Hello from tRPC!"),
});

export type AppRouter = typeof appRouter;

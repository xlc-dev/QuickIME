import { createAuthClient } from "better-auth/solid";

export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
});

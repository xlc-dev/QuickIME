import { toSolidStartHandler } from "better-auth/solid-start";
import { auth } from "~/auth";

export const { GET, POST } = toSolidStartHandler(auth);

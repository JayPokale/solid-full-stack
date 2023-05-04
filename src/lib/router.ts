import { z } from "zod";
import { procedure, router } from "./init";
import userRouter from "./routers/user.router";

export const appRouter = router({
  hello: procedure.input(z.string().nullish()).query(({ input }) => {
    return `hello ${input ?? "world"}`;
  }),

  user: userRouter,
});

export type AppRouter = typeof appRouter;

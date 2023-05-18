import { router } from "./init";
import userRouter from "./routers/user.router";
import postRouter from "./routers/post.router";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;

import { router } from "./init";
import userRouter from "./routers/user.router";
import postRouter from "./routers/post.router";
import postUtils from "./routers/post.utils.router";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  postUtils: postUtils,
});

export type AppRouter = typeof appRouter;

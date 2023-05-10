import { z } from "zod";
import { procedure, router } from "../init";
import * as jwt from "jsonwebtoken";
import userModel from "../schemas/user.model";
import postModel from "../schemas/post.model";
import { randomBytes } from "crypto";

const postRouter = router({
  createPost: procedure
    .input(
      z.object({
        token: z.string(),
        payload: z.object({
          draft: z.boolean().optional(),
          title: z.string(),
          subtitle: z.string(),
          thumbnail: z.string().optional(),
          content: z.array(z.any()).optional(),
          catagories: z.array(z.string()).optional(),
          likes: z.number().optional(),
          views: z.number().optional(),
          saves: z.number().optional(),
          comments: z.number().optional(),
          user_id: z.string().optional(),
          postId: z.string().optional(),
        }),
      })
    )
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const user = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== user.jwtKey) {
          return {
            msg: "Not a valid user",
            error: false,
          };
        }
        const payload = input.payload;
        payload.user_id = _id;
        payload.postId = randomBytes(9).toString("base64");
        console.log(payload);
        await postModel.create(payload);
        return {
          postId: payload.postId,
          success: true,
          error: false,
        };
      } catch (error) {
        return { error };
      }
    }),

  fetchPost: procedure.input(z.string()).query(async ({ input }) => {
    const post = await postModel
      .findOne({ postId: input })
      .select("-_id -__v -user_id");
    if (post.draft) return { msg: "Post not found", error: false };
    const user = await userModel.findById(post.user_id, {
      name: 1,
      username: 1,
      userId: 1,
      bio: 1,
      location: 1,
      profilePhoto: 1,
      followers: 1,
      blocked: 1,
      _id: 0,
    });
    if (user.blocked) return { msg: "Post not found", error: false };
    return { post, user, success: true, error: false };
  }),

  fetchPostForEdit: procedure
    .input(z.object({ token: z.string(), postId: z.string() }))
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const { key } = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== key) {
          return { msg: "Not a valid user", error: false };
        }
        const post = await postModel.findOne({ postId: input.postId });
        if (post.draft) return { msg: "Post not found", error: false };
        if (post.user_id !== _id) {
          return { msg: "Not a valid user", error: false };
        }
        return { post, success: true, error: false };
      } catch (error) {
        return { error };
      }
    }),

  updatePost: procedure
    .input(
      z.object({
        token: z.string(),
        payload: z.object({
          draft: z.boolean().optional(),
          title: z.string(),
          subtitle: z.string(),
          thumbnail: z.string().optional(),
          content: z.array(z.any()).optional(),
          catagories: z.array(z.string()).optional(),
          likes: z.number().optional(),
          views: z.number().optional(),
          saves: z.number().optional(),
          comments: z.number().optional(),
          user_id: z.string().optional(),
          postId: z.string(),
        }),
      })
    )
    .query(async ({ input }) => {}),

  deletePost: procedure
    .input(z.object({ token: z.string(), _id: z.string() }))
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const { key } = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== key) return { msg: "Not a valid user", error: false };
        await postModel.findByIdAndRemove(input._id);
        return { msg: "Deleted", success: true, error: false };
      } catch (error) {
        return { error };
      }
    }),
});

export default postRouter;

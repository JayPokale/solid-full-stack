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
          title: z.string(),
          subtitle: z.string(),
          thumbnail: z.string().optional(),
          content: z.array(z.any()).optional(),
          catagories: z.array(z.string()).optional(),
          user_id: z.string().optional(),
          postId: z.string().optional(),
          draft: z.boolean().optional(),
        }),
      })
    )
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const thisUser = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== thisUser.jwtKey) {
          return {
            msg: "Not a valid user",
            error: false,
          };
        }
        const payload = input.payload;
        payload.user_id = _id;
        payload.postId = randomBytes(9)
          .toString("base64")
          .replaceAll("/", "_")
          .replaceAll("+", "-");
        const post = await postModel.create(payload);
        if (input.payload.draft) {
          await userModel.findByIdAndUpdate(_id, {
            $push: { drafts: post._id },
          });
        } else {
          await userModel.findByIdAndUpdate(_id, {
            $push: { posts: post._id },
            $inc: { countPosts: 1 },
          });
        }
        return {
          postId: payload.postId,
          success: true,
          error: false,
        };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  fetchPost: procedure.input(z.string()).query(async ({ input }) => {
    try {
      const post = await postModel
        .findOne({ postId: input })
        .select("-_id -__v");
      console.log(post);
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
      return { post, user, success: true, error: false };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }),

  fetchPostForEdit: procedure
    .input(z.object({ token: z.string(), postId: z.string() }))
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const thisUser = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== thisUser.jwtKey) {
          return { msg: "Not a valid user", error: false };
        }
        const post = await postModel.findOne({ postId: input.postId });
        if (post.user_id !== _id) {
          return { msg: "Not a valid user", error: false };
        }
        return { post, success: true, error: false };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  updatePost: procedure
    .input(
      z.object({
        token: z.string(),
        _id: z.string(),
        user_id: z.string(),
        payload: z.object({
          draft: z.boolean().optional(),
          title: z.string(),
          subtitle: z.string(),
          thumbnail: z.string().optional(),
          content: z.array(z.any()).optional(),
          catagories: z.array(z.string()).optional(),
        }),
      })
    )
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const thisUser = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== thisUser.jwtKey || input.user_id !== _id) {
          return { msg: "Not a valid user", error: false };
        }
        const post = await postModel.findById(input._id, { draft: 1 });
        await postModel.findByIdAndUpdate(input._id, {
          $set: input.payload,
        });
        const wasDraft = post.draft;
        const isDraft = input.payload.draft;
        console.log(wasDraft, isDraft);
        if (!wasDraft && isDraft) {
          await userModel.findByIdAndUpdate(_id, {
            $pull: { posts: post._id },
            $push: { drafts: post._id },
            $inc: { countPosts: -1 },
          });
        } else if (wasDraft && !isDraft) {
          await userModel.findByIdAndUpdate(_id, {
            $push: { posts: post._id },
            $pull: { drafts: post._id },
            $inc: { countPosts: 1 },
          });
        }
        return { success: true, error: true };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  deletePost: procedure
    .input(z.object({ token: z.string(), _id: z.string() }))
    .query(async ({ input }) => {
      const { _id, jwtKey } = jwt.verify(
        input.token,
        import.meta.env.VITE_JWT_SECRET
      ) as { _id: string; jwtKey: string };
      try {
        const thisUser = await userModel.findById(_id, { _id: 0, jwtKey: 1 });
        if (jwtKey !== thisUser.jwtKey) {
          return { msg: "Not a valid user", error: false };
        }

        const post = await postModel.findById(input._id, { draft: 1 });
        const wasDraft = post.draft;

        await postModel.findByIdAndRemove(input._id);

        if (wasDraft) {
          await userModel.findByIdAndUpdate(_id, {
            $pull: { drafts: post._id },
          });
        } else {
          await userModel.findByIdAndUpdate(_id, {
            $pull: { posts: post._id },
            $inc: { countPosts: -1 },
          });
        }
        return { msg: "Deleted", success: true, error: false };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),
});

export default postRouter;

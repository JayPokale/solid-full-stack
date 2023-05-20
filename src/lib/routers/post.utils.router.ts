import { z } from "zod";
import { procedure, router } from "../init";
import userModel from "../schemas/user.model";
import postModel from "../schemas/post.model";

const postUtils = router({
  postView: procedure.input(z.string()).query(async ({ input }) => {
    const post = await postModel.findOne({ postId: input }, { user_id: 1 });
    await postModel.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    await userModel.findByIdAndUpdate(post.user_id, { $inc: { views: 1 } });
  }),
});

export default postUtils;

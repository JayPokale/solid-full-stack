import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    postId: { type: String, required: true, unique: true },
    draft: { type: Boolean, required: true, default: false },
    title: { type: String },
    subtitle: { type: String },
    thumbnail: { type: String },
    content: [Object],
    catagories: [String],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const postModel = mongoose.models.post || mongoose.model("post", postSchema);

export default postModel;

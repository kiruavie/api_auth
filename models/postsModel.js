import mongoose from "mongoose";

const { Schema } = mongoose;

const postsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est réquis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "LA description est manquante"],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = Schema.model("Post", postsSchema);

export default Post;

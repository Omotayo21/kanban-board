import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxLength: [250, "Your comment must be less than 250 characters"],
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Replies" }],
  },
  {
    timestamps: true,
  }
);

 const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
 
export default Comment;

import mongoose from "mongoose";

const repliesSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxLength: [250, "Your reply must be less than 250 characters"],
  },
  replyingTo: {
    type: String,
    required:true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});

const Replies = mongoose.models.Replies || mongoose.model("Replies", repliesSchema);

export default Replies;

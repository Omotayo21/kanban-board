import { connect } from "../../../../../dbConfig/dbConfig.mjs";
import Feedback from "../../../../../models/feedbackModel.mjs";
import User from "../../../../../models/userModel.mjs";
import Replies from '../../../../../models/repliesModel.mjs'
import Comment from "../../../../../models/commentModel.mjs";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request) {
  connect();

  try {
    const reqBody = await request.json();
    const { newReplyText, username, dataId } = reqBody;

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");
    

    const user = await User.findById(dataId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
const comment = await Comment.findById(commentId);
    const reply = new Replies({
      content: newReplyText,
      replyingTo: username,
      user: user._id,
    });

    await reply.save();

    
    comment.replies.push(reply._id);
    await comment.save();

    return NextResponse.json(comment);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const replyId = searchParams.get("id");
  try {
     await Replies.findByIdAndDelete(replyId);

    console.log("deleted sucess");
    return NextResponse.json({ message: "comment deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { connect } from "../../../../../dbConfig/dbConfig.mjs";
import Feedback from "../../../../../models/feedbackModel.mjs";
import User from "../../../../../models/userModel.mjs";
import Comment from "../../../../../models/commentModel.mjs";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request) {
  connect()
 
    try {
     
const reqBody = await request.json();
const { newCommentText, dataId } = reqBody;
    
      const { searchParams } = new URL(request.url);
      const feedbackId = searchParams.get("id");

      const user = await User.findById(dataId);
      if (!user) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const comment = new Comment({
        content: newCommentText,
        user: user._id,
      
        replies: [],
      });

      await comment.save();

      const feedback = await Feedback.findById(feedbackId);
      feedback.comments.push(comment._id);
      await feedback.save();

      return NextResponse.json(feedback);
    } catch (error) {
      console.log(error)
       return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
};
export async function DELETE(request){
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get("id");
try {
    const comment = await Comment.findByIdAndDelete(commentId);
 
      console.log("deleted sucess")
        return NextResponse.json({message :'comment deleted'}, {status:200});
  
    
} catch (error) {
   console.log(error);
   return NextResponse.json({ error: error.message }, { status: 500 });
}


      }
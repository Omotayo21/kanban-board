import { connect } from "../../../../../dbConfig/dbConfig.mjs";
import Feedback from "../../../../../models/feedbackModel.mjs";
import User from "../../../../../models/userModel.mjs";
import Comment from "../../../../../models/commentModel.mjs";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function PATCH(request) {


  try {
    const reqBody = await request.json();
    const {  dataId } = reqBody;

    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get("id");

    const user = await User.findById(dataId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const feedback = await Feedback.findById(feedbackId);
const hasUpvoted = user.upvotedPosts.includes(feedbackId)
if(hasUpvoted){
    user.upvotedPosts= user.upvotedPosts.filter(id => id.toString() !== feedbackId)
    feedback.upvotes -= 1;
 
} else {
user.upvotedPosts.push(feedbackId)
feedback.upvotes +=1
}
  await user.save()
await feedback.save()
console.log('upvote sucess')
    return NextResponse.json({upvotes: feedback.upvotes, hasUpvoted : !hasUpvoted}, {status:200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 
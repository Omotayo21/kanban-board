import {connect} from '../../../../dbConfig/dbConfig.mjs'
import Feedback from '../../../../models/feedbackModel.mjs'
import { NextRequest, NextResponse } from "next/server";
import Comment from "../../../../models/commentModel.mjs";
import User from "../../../../models/userModel.mjs";
import Replies from "../../../../models/repliesModel.mjs";

export async function GET(request) {
  await connect();

  try {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

   if(!id){throw new Error ('missing id ooo')}
    const feedbacks = await Feedback.findById(id)
      .populate({
        path: "comments",
        populate: [
            {path: 'user'},
         { path: "replies",
          populate: { path: "user" }
        },
      ]})
      .exec();
      console.log(id)

    return new NextResponse(JSON.stringify(feedbacks), { status: 200 });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

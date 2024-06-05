import { connect } from "../../../dbConfig/dbConfig.mjs";
import Feedback from "../../../models/feedbackModel.mjs";
import User from "../../../models/userModel.mjs";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request) {
  connect();

  try {
    const reqBody = await request.json()
    const { title, description, category, dataId } = reqBody

    const user = await User.findById(dataId);
    if (!user) {
     return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const feedback = new Feedback({
      title,
      description,
      category,
      user : user._id,
      status : 'ongoing',
     comments : [],
    });

     await feedback.save();
    user.feedbacks.push(feedback._id);
    await user.save();

    return NextResponse.json(feedback);
  } catch (error) {
    console.log(error);  
   return NextResponse.json({ error: error.message }, { status: 500 });

}
}

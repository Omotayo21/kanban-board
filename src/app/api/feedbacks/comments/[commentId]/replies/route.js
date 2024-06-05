import { connect } from "../../../../../dbConfig/dbConfig.mjs";
import Feedback from "../../../../../models/feedbackModel.mjs";
import User from "../../../../../models/userModel.mjs";
import Comment from "../../../../../models/commentModel.mjs";
import Replies from "../../../../../models/repliesModel.mjs";
import { NextRequest, NextResponse } from "next/server";


export default async function handler(req, res) {
  await dbConnect();

    const { commentId } = req.query;
    const { userId, content } = req.body;

    try {
      const feedback = await Feedback.findOne({ 'comments._id': commentId });
      if (!feedback) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const comment = feedback.comments.id(commentId);

      const reply = {
        content,
        user: userId,
        replies: []
      };

      comment.replies.push(reply);
      await feedback.save();

      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

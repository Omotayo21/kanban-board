
import { connect } from "../dbConfig/dbConfig.mjs";
import User from "../models/userModel.mjs";
import Feedback from "../models/feedbackModel.mjs";
import Comment from "../models/commentModel.mjs";
import Replies from "../models/repliesModel.mjs";
import data from '../data/data.json' assert {type: 'json'};


connect()


  
export const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Feedback.deleteMany();
    await Comment.deleteMany();
    await Replies.deleteMany();

    // Create current user
   const userMap = {}

const createUserIfNotExist= async (userData) => {
    if (!userMap[userData.username]) {
      const createdUser= await User.create({
        name: userData.name,
        username: userData.username,
        image: userData.image,
      });
      userMap[userData.username] = createdUser._id
    }
    return userMap [userData.username]
 
  }



 

   
    // Create posts, comments, and replies





    // Create posts, comments, and replies
    for (const postData of data.productRequests) {
      const postComments = [];
      if(Array.isArray(postData.comments)){
      for (const commentData of postData.comments) {
        const commentReplies = [];
        if (commentData.replies) {
          for (const replyData of commentData.replies) {
            const userId = await createUserIfNotExist(replyData.user)
            const newReply = await Replies.create({
              content: replyData.content,
              replyingTo: replyData.replyingTo,
              user: userId,
            });
            commentReplies.push(newReply._id);
          }
        }
     const userId = await createUserIfNotExist(commentData.user)
        const newComment = await Comment.create({
          content: commentData.content,
          user: userId,
          replies: commentReplies,
        });
        postComments.push(newComment._id);
      }
    }
      await Feedback.create({
        title: postData.title,
        category: postData.category,
        upvotes: postData.upvotes,
        status: postData.status,
        description: postData.description,
        comments: postComments,
      });
    }

    console.log('Data imported successfully');
    process.exit();
 
  }
  catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();






















   
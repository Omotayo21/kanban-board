// pages/api/models/user.js
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  username: {
    type: String,
    required: true,

    lowercase: true,
  },
  image: { type: String },
  
  password: {
    type: String,
    required: [true, "please provide a password"],
  },
  feedbacks: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }], default : []},
 upvotedPosts : {
  type : [mongoose.Schema.Types.ObjectId],
  default : [],
ref: 'Feedback',
},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

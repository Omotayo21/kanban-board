import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "pls provide an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    // Relationship with boards
    boards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

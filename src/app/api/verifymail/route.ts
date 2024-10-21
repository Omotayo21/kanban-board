import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the token
    const reqBody = await request.json();
    const { token }: { token: string } = reqBody;
    console.log(token);

    // Find the user by token and check if the token is still valid
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    console.log(user);

    // Update user verification status and remove the token fields
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    // Send a success response
    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    // Handle errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

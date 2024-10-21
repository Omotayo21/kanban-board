import { getTokenData } from "../../../helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../models/userModel";

connect();

// Define the type of NextRequest explicitly
export async function GET(req: NextRequest) {
  try {
    // Use getTokenData to get userId from the request
    const userId = await getTokenData(req);
    
    // Fetch user data and exclude the password field
    const user = await User.findOne({ _id: userId }).select("-password");
    
    // Return the user data in the response
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    // Handle errors and return a response with status 500
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import bcryptjs from "bcryptjs";
import { sendEmail } from "../../../helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    // Parsing and typing the request body
    const reqBody: { name: string; email: string; password: string } =
      await request.json();
    const { name, email, password } = reqBody;
    console.log(reqBody);

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user instance with typed values
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

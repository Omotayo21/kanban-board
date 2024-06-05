import {connect } from '../../../dbConfig/dbConfig.mjs'
import User from "../../../models/userModel.mjs";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { username, name, password } = reqBody;
    console.log(reqBody);
    // checkif user exists
    const user = await User.findOne({ username });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      name,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
    //send verification emAIL
    return NextResponse.json({
      message: "user created sucessfully",
      success: true,
      savedUser,
    });
 
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import connectDB from "@/lib/db";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest){
  try {
    await connectDB();

    const {name, email, password} =await req.json();
    
    if(!name || !email || !password){
      return NextResponse.json(
        {message:"All fields are required"},
        {status:400}
      )
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return NextResponse.json(
        {message:"User already exist"},
        {status : 409}
      )
    }

    if(password.length<6){
      return NextResponse.json(
        {message:"Password must be at least 6 characters"},
        {status : 400}
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password:hashedPassword
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        user
      },
      {status : 201}
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Register Error", error },
      { status: 500 }
    );    
  }
}                      
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        connectDB();
        const {role,mobile} = await req.json(); 
        const session=await auth()
        const user = await User.findOneAndUpdate(
            {email:session?.user?.email},
            {role,mobile},
            {new:true})

        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status:404})
        }

        return NextResponse.json(
            {message:"User updated successfully", user},
            {status:200}
        )
        
    } catch (error) {
        return NextResponse.json({message:`Edit Role and Mobile Error: ${error}`},{status:500})
    }
}
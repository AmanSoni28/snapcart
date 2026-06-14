import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import { Order } from "@/models/order.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {userId,items,paymentMethod,totalAmount,address} =await req.json();
    if (
      !items.length || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message:"Please send all credentials" },
        {status:401,}
      );
    }

    const user =await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message:"user not found"},
        {status:402}
      );
    }

    const newOrder =await Order.create({
      user:userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await emitEventHandler("new-order",newOrder)                             //(event,data)

    return NextResponse.json(
    {message:"Order Created Successfully", newOrder},
    {status:201,}
);
  } catch (error) {
    return NextResponse.json(
        { message:`place order error ${error}`},
        {status:500}
      );
  }

}
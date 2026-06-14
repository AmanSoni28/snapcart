import connectDB from "@/lib/db";
import { Order } from "@/models/order.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {userId,items,paymentMethod,totalAmount,address} =await req.json();
    if (!items.length || !userId || !paymentMethod || !totalAmount || !address) {
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

    const session= await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        success_url:`${process.env.NEXT_BASE_URL}/user/order-success`,
        cancel_url:`${process.env.NEXT_BASE_URL}/user/cart`,
        line_items:[{
            price_data:{
              currency:"inr",
              product_data:{
                name:"SnapCart Order Payment"
              },
              unit_amount:totalAmount*100
            },
            quantity:1
        }],  

        metadata:{orderId:String(newOrder._id)}             //which is pass to webhook
    })

  

    return NextResponse.json(
        {url:session.url},
        {status:200}
    )
           
  } catch (error) {
    return NextResponse.json(
        { message:`stripe payment error ${error}`},
        {status:500}
      );
  }

}



// <-------------------------------Notes--------------------------------->
// npm install stripe
// if payment done successfully the api/user/stripe/webhook automaticatlly trigged and metadata goes from here to api/user/stripe/webhook
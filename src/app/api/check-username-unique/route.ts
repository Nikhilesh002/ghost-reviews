import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod";
import {usenameValidation} from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema=z.object({
  username:usenameValidation
})

export async function POST(req:NextRequest) {
  await dbConnect();
  try {
    const {username} = await req.json()

    // validate with zod
    const res=UsernameQuerySchema.safeParse({username});
    if(!res.success){
      const usernameErrors=res.error.format().username?._errors || [];
      return NextResponse.json({
        success:false,
        message:usernameErrors?.length>0
                ? usernameErrors.join(',')
                : "Invalid username"
      },{status:400});
    }

    const existingVerifiedUser=await UserModel.findOne({username,isVerified:true});
    if(existingVerifiedUser){
      return NextResponse.json({ success: false, message: "Username already taken" },{status:500});
    }

    return NextResponse.json({ success: true, message: "Username is unique" },{status:200});
  } catch (error) {
    console.error("Failed to check username",error);
    return NextResponse.json({ success: false, message: "Failed to check username" },{status:500});
  }
}
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usenameValidation} from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { URL } from 'url';

const UsernameQuerySchema=z.object({
  username:usenameValidation
})

export async function GET(req:NextRequest) {
  await dbConnect();
  try {
    const currentUrl = new URL(req.url);
    const username = currentUrl.searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username query parameter is required" },
        { status: 400 }
      );
    }
    // validate with zod
    const res=UsernameQuerySchema.safeParse({username});
    console.log("huhu",res)
    if(!res.success){
      const usernameErrors=res.error.format().username?._errors || [];
      return NextResponse.json({
        success:false,
        message:usernameErrors?.length>0
                ? usernameErrors.join(',')
                : "Invalid query parameters"
      },{status:400});
    }

    const existingVerifiedUser=await UserModel.findOne({username,isVerified:true});
    if(existingVerifiedUser){
      return NextResponse.json({ success: false, message: "Username already taken" },{status:500});
    }

    return NextResponse.json({ success: true, message: "Username is unique" },{status:200});
  } catch (error) {
    console.log("Failed to check username",error);
    return NextResponse.json({ success: false, message: "Failed to check username" },{status:500});
  }
}
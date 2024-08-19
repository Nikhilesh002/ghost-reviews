import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usenameValidation} from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema=z.object({
  username:usenameValidation
})

export async function GET(req:NextRequest) {
  await dbConnect();
  try {
    const searchParams = req.nextUrl.searchParams;
    const username=searchParams.get('username');
    // validate with zod
    const res=UsernameQuerySchema.safeParse({username});
    console.log("huhu",res)
    if(!res.success){
      const usernameErrors=res.error.format().username?._errors || [];
      return Response.json({
        success:false,
        message:usernameErrors?.length>0
                ? usernameErrors.join(',')
                : "Invalid query parameters"
      },{status:400});
    }
    // const {username}=res.data

    const existingVerifiedUser=await UserModel.findOne({username,isVerified:true});
    if(existingVerifiedUser){
      return Response.json({ success: false, message: "Username already taken" },{status:500});
    }

    return Response.json({ success: true, message: "Username is unique" },{status:200});
  } catch (error) {
    console.log("Failed to check username",error);
    return Response.json({ success: false, message: "Failed to check username" },{status:500});
  }
}
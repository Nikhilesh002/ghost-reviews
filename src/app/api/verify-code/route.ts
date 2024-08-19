import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import {z} from "zod";
// import {usenameValidation} from "@/schemas/signUpSchema";


export async function POST(req:Request) {
  await dbConnect();
  try {
    const {username,code}=await req.json();
    const decodedUsername=decodeURIComponent(username);

    const user=await UserModel.findOne({username:decodedUsername});
    console.log(user)
    if(!user){
      return Response.json({ success: false, message: "User not found" },{status:500});
    }

    const isCodeCorrect=code===user.verifyCode;
    const isCodeExpired=new Date(user.verifyCodeExpiry)<new Date()

    if(isCodeCorrect && !isCodeExpired){
      user.isVerified=true;
      await user.save();
      return Response.json({ success: true, message: "User verified" },{status:200});
    }
    else if(!isCodeCorrect){
      return Response.json({ success: false, message: "Invalid verification code" },{status:500});
    }
    else if(isCodeExpired){
      return Response.json({ success: false, message: "Verification code expired. Please signup again" },{status:500});
    }

    return Response.json({ success: false, message: "Something went wrong" },{status:500});
  } catch (error) {
    console.log("Failed to verify user",error);
    return Response.json({ success: false, message: "Failed to verify user" },{status:500});
  }
}
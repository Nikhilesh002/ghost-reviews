import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";

export const dynamic = 'force-dynamic';

export async function POST(req:Request) {
  await dbConnect();
  try {
    const session=await getServerSession();
    const user:User=session?.user as User;
    if(!session || !user){
      return Response.json({ success: false, message: "Not authorised" },{status:401});
    }
    const userId=user._id
    // const {acceptMessages}=await req.json();
    const userByUsername=await UserModel.findOne({username:user.name});
    if(!userByUsername){
      return Response.json({ success: false, message: "User not found" },{status:500});
    }
    userByUsername.isAcceptingMessages=!userByUsername.isAcceptingMessages;
    await userByUsername.save();
    return Response.json({ success: true, message: "Toggled accept messages status" },{status:200});
  } catch (error) {
    console.error("Failed to verify user",error);
    return Response.json({ success: false, message: "Failed to toggle accept messages status" },{status:500});
  }
}
 
export async function GET(req:Request) {
  await dbConnect();
  try {
    const session=await getServerSession();
    const user:User=session?.user as User;
    if(!session || !user){
      return Response.json({ success: false, message: "Not authorised" },{status:401});
    }
    const userByUsername=await UserModel.findOne({username:user.name});
    if(!userByUsername){
      return Response.json({ success: false, message: "User not found" },{status:500});
    }
    return Response.json({ success: true, isAcceptingMessages:userByUsername.isAcceptingMessages },{status:200});
  } catch (error) {
    console.error("Failed to verify user",error);
    return Response.json({ success: false, message: "Failed to get accept messages status" },{status:500});
  }
}
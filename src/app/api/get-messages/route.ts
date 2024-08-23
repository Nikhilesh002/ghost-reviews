import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";



export async function GET(req:Request) {
  await dbConnect();
  try {
    // only logged in users have to access
    const session=await getServerSession();
    const user:User=session?.user as User;
    if(!session || !user){
      return Response.json({ success: false, message: "Not authorised" },{status:401});
    }
    const userId=new mongoose.Types.ObjectId(user._id);
    const userById=await UserModel.aggregate([
      {$match:{id:userId}},
      {$unwind:'$messages'},
      {$sort:{'messages.createdAt':-1}},
      {$group:{_id:'$_id',messages:{$push:'$messages'}}}
    ])
    if(!userById || userById.length===0){
      return Response.json({ success: false, message: "User not found" },{status:404});
    }
    return Response.json({ success: true, messages:userById[0].messages },{status:200});
  } catch (error) {
    console.log("Failed to get messages",error);
    return Response.json({ success: false, message: "Failed to toggle accept messages status" },{status:500});
  }
}
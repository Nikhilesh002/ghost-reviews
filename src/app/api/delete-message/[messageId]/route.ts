import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";

export const dynamic = 'force-dynamic';

export async function DELETE(req:Request,{params}:{params:{messageId:string}}) {
  await dbConnect();
  try {
    // only logged in users have to access
    const session=await getServerSession();
    const user:User=session?.user as User;
    if(!session || !user){
      return Response.json({ success: false, message: "Not authorised" },{status:401});
    }
    const messageId=params.messageId;
    const updateRes= await UserModel.updateOne(
      {username:user.name},
      {$pull:{messages:{_id:messageId}}}
    );

    if(updateRes.modifiedCount===0){
      return Response.json({ success: false, message:"Message not found or already deleted" },{status:500});
    }
    return Response.json({ success: true, message:"Message deleted" },{status:200});
  } catch (error) {
    console.error("Failed to delete message",error);
    return Response.json({ success: false, message: "Failed to delete message" },{status:500});
  }
}
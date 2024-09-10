import UserModel from "@/model/User";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

// to toggle or get suggestion status
export async function POST(req:Request){
  try {
    const {type,username}=await req.json();
    if(type==="toggle"){
      const session=await getServerSession();
      if(!session || !session.user){
        return Response.json({ success: false, message: "Not authorised" },{status:401});
      }
      const dbUser=await UserModel.findOne({username:session.user.name});
      if(!dbUser){
        return Response.json({ success: false,message: "User not found" },{status:402});
      }
      dbUser.isSuggestingMessages=!dbUser.isSuggestingMessages;
      dbUser.save();
      return Response.json({ success: true,message: "Toggled AI suggestions" },{status:200});
    }
    else if(type==="see"){
      const dbUser=await UserModel.findOne({username});
      if(!dbUser){
        return Response.json({ success: false,message: "User not found" },{status:402});
      }
      return Response.json({ success: true,message: "AI suggestions status",isSuggestingMessages:dbUser.isSuggestingMessages },{status:200});
    }
  } catch (error) {
    console.error("Some error occured",error);
    return Response.json({ success: false, message: "Failed to toggle suggestions" },{status:500});
  }
}
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";



export async function POST(req:Request) {
  await dbConnect();
  try {
    const {username,content}=await req.json();
    const user=await UserModel.findOne({username,isVerified:true});
    if(!user){
      return Response.json({ success: false, message: "User not found" },{status:404});
    }
    if(!user.isAcceptingMessage){
      return Response.json({ success: false, message: "User is not accepting messages" },{status:401});
    }
    const newMessage={content,createdAt:new Date()} as Message;
    user.messages.push(newMessage);
    await user.save()
    return Response.json({ success: true, messages:"Message sent" },{status:200});
  } catch (error) {
    console.log("Failed to send message : ",error);
    return Response.json({ success: false, message: "Failed to send message" },{status:500});
  }
}
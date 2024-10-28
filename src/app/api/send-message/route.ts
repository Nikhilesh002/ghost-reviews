import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/Forms.model";
import MessageModel, { Message } from "@/model/Messages.model";
import { ObjectId } from "mongoose";



export async function POST(req:Request) {
  await dbConnect();
  try {
    const {formId,content}=await req.json();
    const form=await FormModel.findOne({_id:formId});
    if(!form){
      return Response.json({ success: false, message: "Form not found" },{status:404});
    }
    if(!form.isAcceptingMessages){
      return Response.json({ success: false, message: "Form is not accepting messages" },{status:401});
    }
    const newMessage=new MessageModel({content,createdAt:new Date()});
    form.messages.push(newMessage._id as ObjectId);
    await Promise.all([form.save(),newMessage.save()])
    return Response.json({ success: true, message:"Message sent" },{status:200});
  } catch (error) {
    console.error("Failed to send message : ",error);
    return Response.json({ success: false, message: "Failed to send message" },{status:500});
  }
}

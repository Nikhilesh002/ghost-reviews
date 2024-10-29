"use server"

import MessageModel from "@/model/Messages.model";
import { getAISuggestions } from "@/helpers/getAISuggestions";
import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/Forms.model";
import { ObjectId } from "mongoose";



export const getMessageSuggestions=async (context:string)=>{
  try {
    const res= await getAISuggestions(context);
    return {success:true, messages:res.data.choices[0].message.content }
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}



export const sendMessage=async (formId:string,content:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId});
    if(!formInfo){
      return {success:false};
    }
    const newMessage= new MessageModel({content,createdAt:new Date});
    formInfo.messages.push(newMessage._id as ObjectId);
    await Promise.all([formInfo.save(),newMessage.save()]);

    return {success:true,isAcceptingMessages:formInfo?.isAcceptingMessages ?? false}
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}



export const deleteMessage= async(formId:string,messageId:string)=>{
  await dbConnect();
  try {
    const res=await FormModel.updateOne(
      {_id:formId},
      {$pull:{messages:messageId}}
    );

    if(!res){
      return {success:false}
    }

    await MessageModel.deleteOne({_id:messageId});

    return {message:"Message Deleted"}
  } catch (error) {
    console.error(error)
    return {message:"Failed to delete message"}
  }
}



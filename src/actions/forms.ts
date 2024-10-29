"use server"

import { getAISuggestions } from "@/helpers/getAISuggestions";
import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/Forms.model";
import MessageModel, { Message } from "@/model/Messages.model";
import UserModel from "@/model/User.model"
import { ObjectId } from "mongoose";


export const getAllForms=async (username:string)=>{
  await dbConnect()
  try {

    const userForms = await UserModel.findOne({ username }).populate("forms").exec();

    if(!userForms){
      return {data:[],message:"User not found"};
    }
    
    return userForms.forms;
  } catch (error) {
    console.error(error)
    return {data:[],error, message:"Failed to get user forms"}
  }
}



export const getFormReviews= async(formId:string)=>{
  await dbConnect();
  try {
    const formReviews=await FormModel.findOne({_id:formId}).populate("messages").exec();

    return formReviews?.messages
  } catch (error) {
    console.error(error)
    return []
  }
}



export const createForm= async (username:string,formData:any)=>{
  await dbConnect()
  try {
    const userExists= await UserModel.findOne({username});
    if(!userExists){
      return {message:"User not found"};
    }

    const newForm= new FormModel(formData);
    await newForm.save();

    userExists.forms.push(newForm._id as ObjectId);
    await userExists.save()

    return {message:"Form Created Successfully"};

  } catch (error) {
    console.error(error)
    return {error, message:"Failed to create form"}
  }
}


export const deleteMessage= async(formId:string,messageId:string)=>{
  await dbConnect();
  try {
    const formReviews=await FormModel.updateOne(
      {_id:formId},
      {$pull:{messages:messageId}}
    );

    await MessageModel.deleteOne({_id:messageId});

    return {message:"Message Deleted"}
  } catch (error) {
    console.error(error)
    return {message:"Failed to delete message"}
  }
}



export const getFormInfo= async(formId:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId}).lean();

    return {data:formInfo,message:"Form info"}
  } catch (error) {
    console.error(error)
    return {message:"Failed to get form info"}
  }
}


export const getFormAcceptStatus=async (formId:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId}).lean();
    if(!formInfo){
      return {success:false};
    }
    return {success:true,isAcceptingMessages:formInfo.isAcceptingMessages}
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}



export const toggleFormAcceptStatus=async (formId:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId}).lean();
    if(!formInfo){
      return {success:false};
    }
    formInfo.isAcceptingMessages=!formInfo.isAcceptingMessages;
    await formInfo.save();

    return {success:true}
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
    const newMessage= new MessageModel({content});
    formInfo.messages.push(newMessage._id as ObjectId);
    await Promise.all([formInfo.save(),newMessage.save()]);

    return {success:true,isAcceptingMessages:formInfo?.isAcceptingMessages ?? false}
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}



export const getMessageSuggestions=async (context:string)=>{
  try {
    const res= await getAISuggestions(context);
    return {success:true, messages:res.data.choices[0].message.content }
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}



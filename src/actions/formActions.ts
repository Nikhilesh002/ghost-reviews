"use server"

import dbConnect from "@/lib/dbConnect";
import FormModel, { Form } from "@/model/Forms.model";
import MessageModel from "@/model/Messages.model";
import UserModel from "@/model/User.model"
import { ObjectId } from "mongoose";


export const getAllForms=async (username:string)=>{
  await dbConnect()
  try {
    const userForms = await UserModel.findOne({ username }).populate("forms").exec();

    if(!userForms){
      return {success:false,message:"User not found"};
    }
    
    return {success:true,forms:userForms.forms as unknown as Form[]};
  } catch (error) {
    console.error(error)
    return {success:false,error, message:"Failed to get user forms"}
  }
}



export const getFormReviews= async(formId:string)=>{
  await dbConnect();
  try {
    const formReviews=await FormModel.findOne({_id:formId}).populate("messages").lean().exec();

    return {messages:formReviews?.messages,context:formReviews?.context.toString(),name:formReviews?.name.toString}
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
    userExists.forms.push(newForm._id as ObjectId);
    
    await Promise.all([newForm.save(),userExists.save()]);

    return {message:"Form Created Successfully"};

  } catch (error) {
    console.error(error)
    return {error, message:"Failed to create form"}
  }
}



import { Types } from 'mongoose';

export const getFormInfo = async (formId: string) => {
  await dbConnect();
  try {
    const formInfo = await FormModel.findOne({ _id: formId }).lean();
    if (!formInfo) {
      return { message: "Form not found", data: null };
    }

    // const cnt = await MessageModel.countDocuments();
    // console.log(cnt)

    const transformedForm = {
      name: formInfo.name.toString(),
      context: formInfo.context.toString(),
      isAcceptingMessages: formInfo.isAcceptingMessages,
      isSuggestingMessages: formInfo.isSuggestingMessages,
      _id: formInfo._id.toString(),
      createdAt: formInfo.createdAt?.toISOString(),
      formExpiry: formInfo.formExpiry?.toISOString(),
    } as unknown as Form;

    return { data: transformedForm, message: "Form info" };
  } catch (error) {
    console.error(error);
    return { message: "Failed to get form info", data: null };
  }
};




export const getFormAcceptStatus=async (formId:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId});
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
    const formInfo=await FormModel.findOne({_id:formId});
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



export const getFormAIStatus=async (formId:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId});
    if(!formInfo){
      return {success:false};
    }
    return {success:true,isSuggestingMessages:formInfo.isSuggestingMessages}
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}



export const toggleFormAIStatus=async (formId:string)=>{
  await dbConnect();
  try {
    const formInfo=await FormModel.findOne({_id:formId});
    if(!formInfo){
      return {success:false};
    }
    formInfo.isSuggestingMessages=!formInfo.isSuggestingMessages;
    await formInfo.save();

    return {success:true}
  } catch (error) {
    console.error(error)
    return {success:false,message:"Failed to get form accept status"}
  }
}






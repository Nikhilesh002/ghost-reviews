"use server"

import dbConnect from "@/lib/dbConnect";
import FormModel, { Form } from "@/model/Forms.model";
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
    userExists.forms.push(newForm._id as ObjectId);
    
    await Promise.all([newForm.save(),userExists.save()]);

    return {message:"Form Created Successfully"};

  } catch (error) {
    console.error(error)
    return {error, message:"Failed to create form"}
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




"use server"

import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/Forms.model";
import UserModel from "@/model/User.model"
import mongoose,{ ObjectId } from "mongoose";


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





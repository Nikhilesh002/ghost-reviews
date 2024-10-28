import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/Forms.model";
import UserModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req:Request) {
  await dbConnect();
  try {
    const session=await getServerSession();
    const user:User=session?.user as User;
    if(!session || !user){
      return Response.json({ success: false, message: "Not authorised" },{status:401});
    }
    console.log(req.body)
    const form=await FormModel.findOne({_id:""});
    if(!form){
      return Response.json({ success: false, message: "Form not found" },{status:404});
    }
    form.isAcceptingMessages=!form.isAcceptingMessages;
    await form.save();
    return Response.json({ success: true, message: "Toggled accept messages status" },{status:200});
  } catch (error) {
    console.error("Failed to verify user",error);
    return Response.json({ success: false, message: "Failed to toggle accept messages status" },{status:500});
  }
}

export async function GET(req:NextRequest) {
  await dbConnect();
  try {
    const formId= req.nextUrl.searchParams.get('formId') ?? "";
    const form=await FormModel.findOne({_id:formId});
    if(!form){
      return Response.json({ success: false, message: "Form not found" },{status:404});
    }
    return Response.json({ success: true, isAcceptingMessages:form.isAcceptingMessages },{status:200});
  } catch (error) {
    console.error("Failed to verify user",error);
    return Response.json({ success: false, message: "Failed to get accept messages status" },{status:500});
  }
}

import FormModel from "@/model/Forms.model";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

// to toggle or get suggestion status
export async function POST(req:Request){
  try {
    const {type,formId}=await req.json();
    if(type==="toggle"){
      const session=await getServerSession();
      if(!session || !session.user){
        return Response.json({ success: false, message: "Not authorised" },{status:401});
      }
      const form=await FormModel.findOne({_id:formId});
      if(!form){
        return Response.json({ success: false, message: "Form not found" },{status:404});
      }
      form.isSuggestingMessages=!form.isSuggestingMessages;
      form.save();
      return Response.json({ success: true,message: "Toggled AI suggestions" },{status:200});
    }
    else if(type==="see"){
      const form=await FormModel.findOne({_id:formId});
      if(!form){
        return Response.json({ success: false, message: "Form not found" },{status:404});
      }
      return Response.json({ success: true,message: "AI suggestions status",isSuggestingMessages:form.isSuggestingMessages },{status:200});
    }
  } catch (error) {
    console.error("Some error occured",error);
    return Response.json({ success: false, message: "Error in suggestions api" },{status:500});
  }
}
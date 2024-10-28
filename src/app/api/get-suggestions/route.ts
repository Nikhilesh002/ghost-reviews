import { getSuggestions } from "@/helpers/getSuggestions";
import FormModel from "@/model/Forms.model";

// to get AI suggestions
export async function POST(req:Request) {
  try {
    const {formId}=await req.json()
    const form=await FormModel.findOne({_id:formId});
    if(!form){
      return Response.json({ success: false, message: "Form not found" },{status:404});
    }
    const aiRes=await getSuggestions(form.context);
    return Response.json({ success: true,message: aiRes.data.choices[0].message.content },{status:200});
  } catch (error) {
    console.error("Some error occured",error);
    return Response.json({ success: false, message: "Failed to get suggestions" },{status:500});
  }
}
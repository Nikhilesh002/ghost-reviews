import { getSuggestions } from "@/helpers/getSuggestions";

// to get AI suggestions
export async function GET() {
  try {
    const aiRes=await getSuggestions();
    return Response.json({ success: true,message: aiRes.data.choices[0].message.content },{status:200});
  } catch (error) {
    console.error("Some error occured",error);
    return Response.json({ success: false, message: "Failed to get suggestions" },{status:500});
  }
}
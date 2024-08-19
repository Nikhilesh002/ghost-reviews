import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { AuthOptions } from "next-auth";
// import {z} from "zod";
// import {usenameValidation} from "@/schemas/signUpSchema";


export async function POST(req:Request) {
  await dbConnect();
  try {
    

    return Response.json({ success: false, message: "Something went wrong" },{status:500});
  } catch (error) {
    console.log("Failed to verify user",error);
    return Response.json({ success: false, message: "Failed to verify user" },{status:500});
  }
}
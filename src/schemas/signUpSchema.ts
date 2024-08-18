import {z} from "zod";

export const usenameValidation=z
    .string()
    .min(7,{message:"Username must be atleast 7 characters"})
    .max(17,{message:"Username must be no longer than 17 characters"})
    .regex(/^[a-zA-Z0-9_]+$/,{message:"Username must not contain special characters"})

export const signUpSchema=z.object({
  username:usenameValidation,
  email:z.string().email({message:"Invalid Email address"}),
  password:z.string().min(7,{message:"Password must be atleast 7 characters"})
})
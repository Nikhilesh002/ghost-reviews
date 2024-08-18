import {z} from "zod";

export const messageSchema=z.object({
  content:z.string()
            .min(17,{message:"Message must be atleast 17 characters"})
            .max(300,{message:"Message must be no longer than 300 characters"})
});
import {z} from "zod";

export const createFormSchema=z.object({
  name:z.string(),
  context:z.string(),
  formExpiryDays:z.string(),
  formExpiryHrs:z.string()
});

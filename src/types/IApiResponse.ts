import { Form } from "@/model/Forms.model";
import { Message } from "@/model/Messages.model";

export interface IApiResponse{
  success:boolean,
  message:string,
  isAcceptingMessages?:boolean,
  isSuggestingMessages?:boolean,
  messages?:Message[],
  forms?:Form[]
}
import { Form } from "@/model/Forms.model";
import { Message } from "@/model/Messages.model";
import { User } from "@/model/User.model";

export interface IResponse{
  success:boolean,
  message:string,
  isAcceptingMessages?:boolean,
  isSuggestingMessages?:boolean,
  messages?:Message[],
  forms?:Form[],
  User?:User
}

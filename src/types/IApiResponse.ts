import { Message } from "@/model/User.model";

export interface IApiResponse{
  success:boolean,
  message:string,
  isAcceptingMessages?:boolean,
  isSuggestingMessages?:boolean,
  messages?:Message[],
}
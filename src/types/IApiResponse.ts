import { Message } from "@/model/User";

export interface IApiResponse{
  success:boolean,
  message:string,
  isAcceptingMessagess?:boolean,
  messages?:Message[],
}
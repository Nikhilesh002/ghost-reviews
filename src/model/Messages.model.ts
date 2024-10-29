import mongoose, { Document, Model, Schema } from "mongoose";


export interface Message extends Document{
  content:string;
  createdAt?:Date;
}

const MessageSchema:Schema<Message>=new Schema({
  content:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  }
})

const MessageModel:Model<Message>=(mongoose.models?.Message as Model<Message>) || mongoose.model<Message>("Message",MessageSchema);

export default MessageModel;

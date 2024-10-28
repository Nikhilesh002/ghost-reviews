import mongoose, { Document, Schema } from "mongoose";
import { Model } from "mongoose";

export interface Form extends Document{
  name:String;
  isAcceptingMessages:boolean;
  isSuggestingMessages:boolean;
  context:String;
  messages:Schema.Types.ObjectId[];
  createdAt:Date;
  formExpiry:Date;
}

const FormSchema:Schema<Form>=new Schema({
  name:{type:String},
  isAcceptingMessages:{
    type:Boolean,
    default:true
  },
  isSuggestingMessages:{
    type:Boolean,
    default:true
  },
  context:{type:String, required:true},
  messages:[{type:Schema.Types.ObjectId,ref:"Message"}],
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  },
  formExpiry:{
    type:Date,
    required:true,
    default:Date.now
  },
})

const FormModel:Model<Form>=(mongoose.models?.Form as Model<Form>) || (mongoose.model<Form>("Form",FormSchema));

export default FormModel;

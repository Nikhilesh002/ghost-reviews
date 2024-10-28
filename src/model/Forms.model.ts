import mongoose, { Document, Schema } from "mongoose";

export interface Form extends Document{
  isAcceptingMessages:boolean;
  isSuggestingMessages:boolean;
  context:String;
  messages:Schema.Types.ObjectId[]
}

const FormSchema:Schema<Form>=new Schema({
  isAcceptingMessages:{
    type:Boolean,
    default:true
  },
  isSuggestingMessages:{
    type:Boolean,
    default:true
  },
  context:{type:String, required:true},
  messages:[{type:Schema.Types.ObjectId,ref:"Message"}]
})

const FormModel=(mongoose.models.Form as mongoose.Model<Form>) || (mongoose.model<Form>("Form",FormSchema));

export default FormModel;

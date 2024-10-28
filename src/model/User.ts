import mongoose, { Document, Schema } from "mongoose";


export interface User extends Document{
  username:string;
  email:string;
  password:string;
  verifyCode:string;
  verifyCodeExpiry:Date;
  isVerified:boolean;
  forms:Schema.Types.ObjectId[]
}

const UserSchema:Schema<User>=new Schema({
  username:{
    type:String,
    required:[true,"Username is required"],
    trim:true,
    unique:true
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"Please enter valid Email"],

  },
  password:{
    type:String,
    required:[true,"Password is required"],
  },
  verifyCode:{
    type:String,
    required:true,
  },
  verifyCodeExpiry:{
    type:Date,
    required:[true,"verifyCodeExpiry is required"],
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  forms:[{type:Schema.Types.ObjectId,ref:"form"}]
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema));

export default UserModel;
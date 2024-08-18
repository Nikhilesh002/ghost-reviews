import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import  {sendVerificationEmail}  from "@/helpers/sendVerficationEmail";

export async function POST(req:Request) {
  await dbConnect();
  try {
    const {username,email,password}:{username:string,email:string,password:string} = await req.json();
    // check if username already exists
    const existingUserVerifiedByUsername=await UserModel.findOne({username:username,isVerified:true});
    if(existingUserVerifiedByUsername){
      return Response.json(
        {success:false,message:"Username already taken"},
        {status:400}
      )
    }
    // check if email already exists
    const existingUserByEmail=await UserModel.findOne({email:email});
    // const verifyCode=Math.floor(((Math.random()+1)*1000000)%1000003).toString();
    const newVerifyCode=Math.floor(100000+Math.random()*900000).toString();
    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json(
          {success:true,message:"User already exists with this email"},
          {status:400}
        );
      }
      else{
        const hashedPwd=await bcrypt.hash(password,10);
        existingUserByEmail.password=hashedPwd;
        existingUserByEmail.verifyCode=newVerifyCode;
        existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);  // +1hr in ms
        await existingUserByEmail.save();
      }
    }
    else{
      // create new user as no match with username,email
      const hashedPwd=await bcrypt.hash(password,10);
      const  expiryDate=new Date();
      expiryDate.setHours(expiryDate.getHours()+1);
      const newUser= new UserModel({
        username,   // eqv to username:username
        email,
        password:hashedPwd,
        verifyCode:newVerifyCode,
        verifyCodeExpiry:expiryDate,
        isVerified:false,
        isAcceptingMessage:true,
        messages:[],
      })
      await newUser.save();
    }
    // send verification email
    const emailResponse= await sendVerificationEmail(email,username,newVerifyCode);
    if(!emailResponse.success){
      return Response.json(
        {success:false,message:emailResponse.message},
        {status:600}
      );
    }
    return Response.json(
      {success:true,message:"User registered successfully. Please verify email"},
      {status:700}
    );

  } catch (error) {
    console.error("Error registering user",error);
    return Response.json(
      {success:false,message:"Failed to register user"},
      {status:500}
    )
  }
}
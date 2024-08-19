import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
  providers:[
    CredentialsProvider({
      id: "domain-login",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials:any,req:any):Promise<any>{
        // u can extract data via credentials.identifier.email etc
        // here we write logic to verify user details obtained from prev line
        await dbConnect();
        try {
          const user=await UserModel.findOne({
            $or:[
            {email:credentials.identifier.email},
            {username:credentials.identifier.username} // eqv to credentials.identifier.username
            ]
          });
          if(!user){
            throw new Error("no user Found");
          }
          if(!user.isVerified){
            throw new Error("Verify account before login");
          }
          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
          if(isPasswordCorrect){
            return user;
          }
          else{
            throw new Error("Wrong password");
          }
        } catch (error:any) {
          throw new Error(error);
        }
      }
    })
  ],
  callbacks:{
    async session({ session, token }) {
      if(token){
        session.user._id=token._id;
        session.user.isVerified=token.isVerified;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.username=token.username
      }
      return session
    },
    async jwt({ token, user}) {   // called first ig
      if(user){
        token._id=user._id?.toString();
        token.isVerified=user.isVerified;
        token.isAcceptingMessages=user.isAcceptingMessages;
        token.username=user.username
      }
      return token
    }
  },
  pages:{
    signIn: "/signin",
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_KEY
}
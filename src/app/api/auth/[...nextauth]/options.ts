import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions:NextAuthOptions={
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "identifier", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials:any,req:any):Promise<any>{
        await dbConnect();
        try {
          const user=await UserModel.findOne({
            $or:[
            {email:credentials.identifier},
            {username:credentials.identifier}
            ]
          });          
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (error:any) {
          throw new Error(error);
        }
      }
    })
  ],
  callbacks:{
  //   async signIn({ user, account, credentials }) {
  //     if(account?.provider==='github'){

  //     }
  //     return true
  //   },
    async session({ session, token }) {
      console.log("insession-token-",token,"session-",session)
      if(token){
        session.user._id=token._id;
        session.user.isVerified=token.isVerified;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.username=token.username
      }
      else console.log("No token")
      console.log("insessionret-token-",token,"session-",session)
      return session
    },
    async jwt({ token, user}) {
      console.log("injwt-token-",token,"user-",user)
      if(user){
        token._id=user._id?.toString();
        token.isVerified=user.isVerified;
        token.isAcceptingMessages=user.isAcceptingMessages;
        token.username=user.username
        token.name=user.username
        token.picture=''
      }
      else console.log("No user")
      console.log("injwtatret-token-",token,"user-",user)
      return token
    }
  },
  pages:{
    signIn: "/signin",
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET
};
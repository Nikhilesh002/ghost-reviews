import { resend } from "@/lib/resend";
import { IApiResponse } from '@/types/IApiResponse';
import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<IApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Ghost Reviews Verification code',
      react: VerificationEmail({username,verifyCode})
    });
    return {success:true,message:"OTP sent successfully"}
  } catch (emailError) {
    console.log("Error in sending otp",emailError);
    return {success:false,message:"Failed to send otp"}
  }
}
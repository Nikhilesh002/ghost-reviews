import { resend } from "@/lib/resend";
import { IApiResponse } from '@/types/IApiResponse';
import { VerificationEmail } from '../../emails/VerificationEmail';

export async function sendVerificationEmail({ email, username, verifyCode }: { email: string, username: string, verifyCode: string }): Promise<IApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL||'',
      to: email,
      subject: 'Ghost Reviews Verification code',
      react: VerificationEmail({username,verifyCode})
    });

    if (error) {
      return { success: false, message: "resend error" };
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (emailError) {
    console.error("Error in sending OTP", emailError);
    return { success: false, message: "Failed to send OTP" };
  }
}

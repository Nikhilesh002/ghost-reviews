"use client"
import emailjs from '@emailjs/browser';

export async function sendOtp({ email, username, verifyCode }: { email: string; username: string; verifyCode: string }) {
  const templateParams = { email, username, verifyCode };
  console.log(templateParams);

  // Initialize EmailJS with your public key
  emailjs.init(process.env.EMAILJS_PUBLIC_KEY || '');

  try {
    const emailjsRes = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || '',
      process.env.EMAILJS_TEMPLATE_ID || '',
      templateParams,
      { publicKey: process.env.EMAILJS_PUBLIC_KEY || '' }
    );
    console.log(emailjsRes);

    return { success: true, message: 'OTP sent successfully' };
  } catch (emailError) {
    console.error('Error in sending OTP', emailError);
    return { success: false, message: 'Failed to send OTP' };
  }
}

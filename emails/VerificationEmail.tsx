"use client"
import { resend } from "@/lib/resend";
import { Html,Head,Body,Font,Button,Preview,Heading,Row,Section,Text } from "@react-email/components";

interface EmailVerificatoinProps{
  username:string,
  verifyCode:string
}

export default function VerificationEmail({username,verifyCode}:EmailVerificatoinProps){
  return(
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font fontFamily="Roboto" fallbackFontFamily="Verdana" fontWeight={400} fontStyle="normal" />
      </Head>
      <Body>
        <Preview>Here&apos;s your verification code: {verifyCode}</Preview>
        <Section>
          <Row>
            <Heading>Hello {username}</Heading>
          </Row>
          <Row>
            <Text>Thanks for registering. Your OTP is </Text>
          </Row>
          <Row>
            <Text>{verifyCode}</Text>
          </Row>
          <Row>
            <Text>If you did not request this, Please contact us. </Text>
          </Row>
          {/* <Row>
              <Button></Button>
            <button onclick="location.href='https://www.google.com'" type="submit">
              www.example.com</button>
          </Row> */}
        </Section>
      </Body>
    </Html>
  )
};

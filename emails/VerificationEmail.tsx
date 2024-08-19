import { Body, Font, Head, Heading, Html, Preview, Row, Section, Text } from "@react-email/components";

interface EmailVerificationProps {
  username: string;
  verifyCode: string;
}

export function VerificationEmail({ username, verifyCode }: EmailVerificationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font fontFamily="Roboto" fallbackFontFamily="Verdana" fontWeight={400} fontStyle="normal" />
      </Head>
      <Body>
        <Preview>Here&apos;s your verification code: {verifyCode}</Preview>
        <Section>
          <Row>
            <Heading>Hello, {username}</Heading>
          </Row>
          <Row>
            <Text>Thanks for registering. Your OTP is:</Text>
          </Row>
          <Row>
            <Text>{verifyCode}</Text>
          </Row>
          <Row>
            <Text>If you did not request this, please contact us.</Text>
          </Row>
          {/* Uncomment and adjust the following button if you want to include a call to action */}
          {/* 
          <Row>
            <Button href="https://www.example.com">Verify Your Account</Button>
          </Row>
          */}
        </Section>
      </Body>
    </Html>
  );
}

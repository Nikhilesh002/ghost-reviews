import { Body, Font, Head, Heading, Html, Preview, Row, Section, Text, Button } from "@react-email/components";

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
      <Body style={{ margin: 0, padding: '20px', backgroundColor: '#f7f7f7', fontFamily: 'Roboto, Verdana, sans-serif' }}>
        <Preview>Here&apos;s your verification code: {verifyCode}</Preview>
        <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', maxWidth: '600px', margin: 'auto' }}>
          <Row>
            <Heading style={{ fontSize: '24px', marginBottom: '10px' }}>Hello, {username}</Heading>
          </Row>
          <Row>
            <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '10px' }}>Thanks for registering. Your OTP is:</Text>
          </Row>
          <Row>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', padding: '10px 0', border: '1px solid #ddd', display: 'inline-block', borderRadius: '5px' }}>
              {verifyCode}
            </Text>
          </Row>
          <Row>
            <Text style={{ fontSize: '16px', lineHeight: '1.5', marginTop: '20px' }}>If you did not request this, please contact us.</Text>
          </Row>
          
          <Row>
            <Button href={`https://ghostreviews.vercel.app/verify/${username}`} style={{ marginTop: '20px', backgroundColor: '#007BFF', color: '#ffffff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }}>
              Verify Your Account
            </Button>
          </Row>
         
        </Section>
      </Body>
    </Html>
  );
}

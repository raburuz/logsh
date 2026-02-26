import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface TrialWillEndEmailProps {
  userName?: string;
  upgradeUrl?: string;
  companyName?: string;
}

export const TrialWillEndEmail = ( data : TrialWillEndEmailProps) => {

  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-notion">
            <Preview>Log in with this magic link</Preview>
            <Container className="px-3 mx-auto">
              <Text className="text-[#333] text-[14px] my-6 mb-3.5">
                Hey {data.userName},
              </Text>
              <Text className="text-[#333] text-[14px] leading-5.5 mt-3.5 mb-4">
                Your {data.companyName} free trial ends tomorrow.
                <Link
                  href={data.upgradeUrl}
                  target="_blank"
                  className="text-[#1a73e8] text-sm underline px-1"
                >
                  Pick a plan
                </Link>
                to continue tracking your events and get access to advanced features.
              </Text>
              <Text className="text-[#333] text-[14px] my-6 mb-3.5">
                If you have any questions, just reply to this email - we&apos;re here to help!
              </Text>
              <Text className="text-[#898989] text-[12px] mt-3 mb-6">
                — Jean Ramirez
              </Text>
            </Container>
          </Body>
      </Tailwind>
    </Html>
  );
};
TrialWillEndEmail.PreviewProps = {
  userName: "Alex",
  upgradeUrl: "https://yourapp.com/upgrade",
  companyName: "logsh.co",
} as TrialWillEndEmailProps;

export default TrialWillEndEmail;

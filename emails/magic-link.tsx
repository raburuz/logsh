import { config } from '@/modules/shared/config';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface MagicLinkEmailProps {
  loginUrl?: string;
}

export const MagicLinkEmail = ({
  loginUrl,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-notion">
        <Preview>Log in with this magic link</Preview>
        <Container className="px-3 mx-auto">
          <Heading className="text-[#333] text-[24px] my-10 mx-0 p-0">
            Login
          </Heading>
          <Link
            href={loginUrl}
            target="_blank"
            className="text-[#1a73e8] text-[14px] underline mb-4 block"
          >
            Click here to log in with this magic link
          </Link>
          <Text className="text-[#333] text-[14px] my-6 mb-3.5">
            Or, copy and paste this login url:
          </Text>
          <code className="inline-block py-4 px-[4.5%] w-9/10 bg-[#f4f4f4] rounded-md border border-solid border-[#eee] text-[#333]">
            {loginUrl}
          </code>
          <Text className="text-[#ababab] text-[14px] mt-3.5 mb-4">
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text className="text-[#333] text-[12px] leading-5.5 mt-3 mb-6">
            <Link
              href={loginUrl}
              target="_blank"
              className="text-[#1a73e8] text-sm underline"
            >
              {config.app.name}
            </Link>
            , Get real-time visibility and alerts for everything you run,
            <br />
            all in one place.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  loginUrl: 'https://example.com/magic-link',
} as MagicLinkEmailProps;

export default MagicLinkEmail;

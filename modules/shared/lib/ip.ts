import { headers } from "next/headers";

//https://docs.railway.com/networking/public-networking/specs-and-limits
export const ipAddressHeaders = [
  'x-forwarded-for', // Standard header
  'x-real-ip', // nginx
  'cf-connecting-ip', // Cloudflare
];

export const getClientIp = async () => {
  const header = await headers();

  const rawForwarded = header.get('x-forwarded-for');

  const ip =
    rawForwarded?.split(',')[0]?.trim() ||
    header.get('x-real-ip') ||
    header.get('cf-connecting-ip') ||
    '0.0.0.0';

  return ip;
}
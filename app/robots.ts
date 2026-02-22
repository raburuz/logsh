/* NEXT */
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') as string;

  /* Production environment must be https:// */
  const domain = "https://" + host;

  return {
    rules: {
      userAgent: "*",
      disallow: ["/legal/", "/api/", "/auth", "/_next/"],
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
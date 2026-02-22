/* NEXT */
import { MetadataRoute } from "next";
import { headers } from "next/headers";

/* SITEMAP */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host') as string;
  
  /* Production environment must be https:// */
  const domain = "https://" + host;

  return [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${domain}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.1,
    },
  ];
}
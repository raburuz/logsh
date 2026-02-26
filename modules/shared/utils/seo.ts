/* NEXT */
import type { Metadata } from 'next';
import { config } from '../config';


const { seo: seoAttributes , socialMedia } = config.marketing;

const default_title = seoAttributes.title;
const default_description = seoAttributes.description;

interface IDefaultMetadataProps{
  title?: string, 
  description?: string,
}

const defaultMetadata= async ( data?: IDefaultMetadataProps ): Promise<Metadata> => {

  const domain = "https://" + config.app.domain;

  const title = data?.title ?? default_title; 
  const description = data?.description ?? default_description; 

  return {
    title,
    description,
    applicationName: config.app.name.toLowerCase(),
    openGraph: {
      type: "website",
      url: domain,
      title,
      description,
      siteName: config.app.name.toLowerCase(),
      images: [{
        alt: title,
        url: '/og-image.png',
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      title,
      description,
      site: domain,
      card: "summary_large_image",
      creator: `${socialMedia.x.username}`,
      images: [{
        alt: title,
        url: '/og-image.png',
        width: 1200,
        height: 630,
      }],
    },
    metadataBase: new URL(domain),
    alternates:{
      canonical: '/',
    },
    category: seoAttributes.category,
    keywords: seoAttributes.keywords,
    appleWebApp: {
      title: config.app.shortName,
      startupImage: '/apple-touch-icon.png',
      statusBarStyle: 'default',
      capable: true,
    },
    icons:{
      icon: [ 
        { rel: 'shortcut icon', url: "/favicon.ico" },
        { type: "image/svg+xml", url: "/favicon.svg" }, 
        { type: "image/png", url: "/favicon-96x96.png", sizes: "96x96" }
      ],
    }
  }
}

export const seo = async ( metadata?: Metadata ): Promise<Metadata> => {

  if(!metadata) return await defaultMetadata();

  const { title, description, ...props } = metadata;

  return {
    ...await defaultMetadata({
      title: title as string | undefined, 
      description: description as string | undefined,
    }),
    ...props,
  }

} 
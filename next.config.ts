import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options:{
    rehypePlugins: [
      'rehype-pretty-code',
    ],
    remarkPlugins: [
      'remark-gfm'
    ]
  }
});

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: false,
  typedRoutes: true,
  poweredByHeader: false,
  headers: async () => {
    return [
      {
        //https://nextjs.org/docs/app/guides/progressive-web-apps#8-securing-your-application
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ]
      },
    ]
  }
};



export default withMDX(nextConfig);

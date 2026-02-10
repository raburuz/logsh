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
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ]
      }
    ]
  }
};



export default withMDX(nextConfig);

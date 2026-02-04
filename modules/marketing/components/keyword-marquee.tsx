"use client"

const keywords = [
  "Javascript",
  "php",
  "python",
  "typescript",
  "laravel",
  "django",
  "go",
  "react js",
  "next js",
  "vue js",
  "svelte",
  "node js",
  "express js",
]

const keywordsRow2 = [
  "serverless",
  "CI/CD",
  "deno",
  "flutter",
  "ruby on rails",
  "infrastructure",
  "IoT",
  "symfony",
  "java",
  "java spring",
  "c#",
  ".net core",
  "react native",
]
const keywordsRow3 = [
  "github actions",
  "shopify",
  "prestashop",
  "wordpress",
  "ShipFast",
  "ghost",
  "headless cms",
]

export function KeywordMarquee() {
  return (
    <div className="relative py-8 overflow-hidden">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent z-10" />
      
      {/* Row 1 */}
      <div className="flex mb-3 animate-marquee">
        <div className="flex gap-3 pr-3">
          {[...keywords, ...keywords].map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-full whitespace-nowrap bg-black"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
      
      {/* Row 2 - Reverse Direction */}
      <div className="flex mb-3 animate-marquee-reverse">
        <div className="flex gap-3 pr-3">
          {[...keywordsRow2, ...keywordsRow2].map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-full whitespace-nowrap bg-black"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex mb-3 animate-marquee">
        <div className="flex gap-3 pr-3">
          {[...keywordsRow3, ...keywordsRow3].map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-full whitespace-nowrap bg-black"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

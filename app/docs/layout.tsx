"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ILinkProps {
  title: string;
  href: string;
}

interface ILinkItem {
  title: string;
  href: string;
  children: ILinkProps[];
}

const links: ILinkItem[] = [
  {
    title: "🚀 Get started",
    href: "/docs/get-started",
    children: [
      {
        title: "Create api key",
        href: "/docs/get-started#create-api-key",
      },
      {
        title: "Create workspace",
        href: "/docs/get-started#create-workspace",
      },
      {
        title: "Tracking events",
        href: "/docs/get-started#tracking-events",
      }
    ],
  },
  {
    title: `📗 Api reference`,
    href: "/docs/api-reference",
    children: [
      {
        title: "Event",
        href: "/docs/api-reference#event",
      }
    ]
  }
]  

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {
            isOpen ? (
              <X />
            ) : (
              <Menu />
            )
          }
        </Button>
      </div>
      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div className="w-full fixed inset-0 top-0 left-0 right-0 bottom-0 z-30 backdrop-blur-[1px] lg:hidden" onClick={() => setIsOpen(false)}></div>
          <div className="pt-10 w-96 fixed inset-0 top-0 left-0 right-0 bottom-0 z-40 h-screen bg-black border-r border-zinc-900/30 overflow-y-auto lg:hidden">
            <div className="flex flex-col gap-2 p-4">
              {links.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-row items-center gap-1.5 mb-4">
                    <Link 
                      href={item.href as any} 
                      className="text-base text-zinc-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </div>
                  <div className="mb-3 space-y-2 pl-4">
                    {item.children.map((child) => (
                      <div key={child.title}>
                        <Link 
                          href={child.href as any} 
                          className="text-sm hover:text-zinc-100 text-zinc-400"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </>
      )}
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-start mt-10">

        {/* Desktop Sidebar */}
        <div className="sticky top-20 self-start hidden lg:flex flex-col gap-2 w-60">
          {links.map((item) => (
            <div key={item.title}>
              <div className="flex flex-row items-center gap-1.5 mb-4">
                <Link 
                  href={item.href as any} 
                  className="text-base text-zinc-100"
                >
                  {item.title}
                </Link>
              </div>
              <div className="pr-4 mb-3 space-y-2">
                {item.children.map((child) => (
                  <div key={child.title}>
                    <Link 
                      href={child.href as any} 
                      className="text-sm hover:text-zinc-100 text-zinc-400"
                    >
                      {child.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <main className={cn(
          "prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-white prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg",
          "w-full max-w-3xl mx-auto flex-1"
        )}>
          <div>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
import { config } from "@/modules/shared/config";
import Link from "next/link";

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
    title: "Get Started",
    href: "/docs/get-started",
    children: [
      {
        title: "Create Api Key",
        href: "/docs/get-started#create-api-key",
      },
      {
        title: "Create Workspace",
        href: "/docs/get-started#create-workspace",
      },
      {
        title: "Tracking Events",
        href: "/docs/get-started#tracking-events",
      }
    ],
  },
  {
    title: `Api Reference`,
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
  return (
    <div 
      className="flex-1 mt-10 w-full flex flex-row gap-6 justify-start items-start">
        {/* Sidebar */}
      <div className="pt-10 sticky top-20 self-start flex flex-col gap-2 w-60 ">
        <h2 className="text-lg font-bold text-white mb-2">{config.app.name} Docs</h2>
        {
          links.map((item) => {
            return (
              <div key={item.title}>
                <div className="flex flex-row items-center gap-1.5 mb-2">
                  <span>·</span>
                  <Link href={item.href} className="hover:text-white">{item.title}</Link>
                </div>
                <div className="pr-4 mb-3">
                  {
                    item.children.map((child) => (
                      <div key={child.title} className="pl-4">
                        <div className="flex flex-row items-center gap-1.5">
                          <span>-</span>
                          <Link href={child.href} className="text-sm hover:text-white text-white/60">{child.title}</Link>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      {/* Content */}
      <main className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-white prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg text-white/80 w-full max-w-3xl">
        {children}
      </main>
    </div>
  );
}
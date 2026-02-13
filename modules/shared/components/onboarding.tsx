"use client"

import { useState } from "react"
import { createHighlighter } from 'shiki'
import { Testimonial } from "@/modules/marketing/components/testimonial"
import { Button } from "@/components/ui/button"
import { config } from "../config"
import { Feed } from "@/modules/feed/components/feed"


const highlighter = createHighlighter({
  themes: ['github-dark'],
  langs: ['javascript'],
})


const code = `
export const sendLogshEvent = async ( data ) => {
 
  const response = await fetch(
    'https://logsh.co/api/event', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ?', // Your API Key
      },
      body: JSON.stringify({
        workspace: data.workspace,    // Your workspace name
        event: data.event,            // Event name
        description: data.description, // Event description
        color: data.color,              // Event color Hex (optional) 
      }),
    }
  )
 
  const result = await response.json();
 
  if( !response.ok ) {
    throw new Error(result.message || 'Failed to send event to Logsh');
  } 
}
 
  `;

// Inside an async server component, or client side `useEffect`
const html = (await highlighter).codeToHtml(code, {
  lang: 'javascript',
  theme: 'github-dark'
})

export const Onboarding = () => {

  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['welcome', 'first event', 'dashboard']);

  const goToDashboard = () => {
    // Implement navigation to dashboard here, e.g. using Next.js router
    // router.push('/dashboard');

  }

  return (
    <div className="w-full sm:max-w-xl sm:py-10 flex flex-col gap-8">

      <div className="flex flex-items justify-start ">
        <div className="text-xs flex flex-row items-center gap-1 text-zinc-500">
          {
            breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex flex-row items-center gap-1">
                <span className="cursor-pointer" onClick={() => setBreadcrumbs(breadcrumbs.slice(0, index + 1))}>
                  {crumb}
                </span>
                <span>
                  {index < breadcrumbs.length - 1 && '/'}
                </span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Screen 1 */}
      <>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 pb-4">
            <h3 className="text-base font-bold">What do you want to track?</h3>
            <p className="text-sm text-zinc-500">Choose one to get started. You can add more later.</p>
          </div>
          <div className="flex flex-col gap-2">
            {
              [
                {
                  icon: '👥',
                  workspace: 'User activity',
                  description: 'Monitor user interactions, behavior, and engagement on your platform.', 
                },
                {
                  icon: '💰',
                  workspace: 'Billing & Revenue',
                  description: 'Track your financial transactions and revenue streams.', 
                },
                {
                  icon: '📦',
                  workspace: 'Orders & Deliveries',
                  description: 'Manage and monitor order processing and delivery status.', 
                },
                {
                  icon: '📢',
                  workspace: 'Marketing',
                  description: 'Analyze marketing campaigns and customer engagement.', 
                },
                {
                  icon: '🔧',
                  workspace: 'Infrastructure & Errors',
                  description: 'Monitor system infrastructure and error logs.', 
                },
                {
                  icon: '🤷‍♂️',
                  workspace: 'Others',
                  description: 'Other categories that may be relevant to your business.', 
                }
              ].map((item, index) => (
                <div key={index} className="border border-zinc-900/40 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-zinc-900/200 hover:border-zinc-900/50 hover:-translate-y-0.5 flex items-center gap-4" data-value="user-activity">
                    <div className="text-xl w-8 text-center">{item.icon}</div>
                    <div className="flex-1">
                        <div className="font-sm text-[15px] mb-0.5">{item.workspace}</div>
                        <div className="text-xs text-zinc-600">{item.description}</div>
                    </div>
                </div>
              ))
            }
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            <Button size={'lg'} className="w-full">Continue</Button> 
            <span className="text-sm mt-4">Skip onboarding</span> 
          </div>
        </div>
      </>

      {/* Screen 2 */}
      <>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 pb-4">
            <h3 className="text-base font-bold">Stay in the loop</h3>
            <p className="text-sm text-zinc-500">Get instant notifications when important events happen in your product.</p>
          </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-zinc-900/20 rounded-xl flex items-center justify-center text-2xl">
                  🔔
                </div>
                <div className="flex-1">
                    <div className="font-medium text-[15px] mb-1">Push notifications</div>
                    <div className="text-[13px] text-zinc-500">Receive alerts on desktop and mobile</div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
              {
                ['Never miss critical events', 'Respond to issues immediately', 'Works across all your devices'].map((item, index) =>(
                  <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 text-sm">✓</div>
                      <div className="text-[14px] text-zinc-500">{item}</div>
                  </div>

                ))
              }
              
            </div>

            <div className="bg-zinc-900/20 border border-zinc-900/30 rounded-lg p-3 flex items-center gap-3">
                <div className="text-xl">💡</div>
                <div className="text-[13px] text-zinc-500">You can customize notification settings anytime in your dashboard</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            <Button size={'lg'} className="w-full">Enable notifications</Button> 
          </div>
        </div>
      </>

      {/* Screen 3 */}
      <>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 pb-4">
            <h3 className="text-base font-bold">Send your first event</h3>
            <p className="text-sm text-zinc-500">Copy this code and paste it in your project. You'll see the event appear in real-time.</p>
          </div>
          <div className="flex flex-col gap-2 border border-zinc-900/30 bg-zinc-900/10 rounded-xl p-4">
            <span className="text-sm font-semibold">Javascript</span>
            <div className="mt-2">
              <pre className="bg-zinc-900/30 rounded-lg p-4 text-sm overflow-x-auto">
                <div className="[&>pre]:bg-transparent! text-xs" dangerouslySetInnerHTML={{ __html: html.replace('?', 'xxxx')}}/>
              </pre>
            </div>
          </div>
          <span className="mt-4 text-center text-zinc-500 text-xs">or try it right now</span>
            <div className="flex flex-col items-center gap-2 mt-4">
            <Button size={'lg'} className="w-full">Send test event</Button>
          </div>
        </div>
      </>

      {/* Screen 4 */}
      <>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 pb-4">
            <div className="flex items-center gap-2 text-emerald-500 text-sm mb-4">
              <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">✓</div>
              <span>Event received successfully</span>
            </div>
            <h3 className="text-base font-bold">Your first event</h3>
            <p className="text-sm text-zinc-500">You just sent your first event to {config.app.name}. This is how it looks in real-time.</p>
          </div>
          <div className="mt-2 flex flex-col gap-2 border border-zinc-900/30 bg-zinc-900/10 rounded-xl p-4">
            <Feed/>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            <Button size={'lg'} className="w-full">Go to dashboard</Button> 
          </div>
        </div>
      </>

      {/* Why logsh */}
      <span className="text-sm my-2 self-center cursor-pointer hover:text-white">Skip onboarding</span> 
      <Testimonial/>

    </div>
  )
}
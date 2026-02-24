"use client"

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { codeExamples, Languajes } from '../data/code';

export const APIIntegrationShowcase = () => {

  const [activeTab, setActiveTab] = useState<Languajes>('javascript');
  const [copied, setCopied] = useState(false);
  const currentCode = codeExamples[activeTab];

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-16 w-full">
      <div className="mx-auto md:px-4">
        {/* Header */}
        <div className="w-full mb-16 text-center">
          <h2 className="md:text-3xl text-2xl font-semibold tracking-tight text-zinc-100 text-balance">
            Plug into any REST API in minutes
            <br />
            and <span className='text-green-400'>monitor</span> your <span className="text-green-400">like a pro</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 max-w-xl mx-auto">
            Logsh provides seamless integration with any REST API, giving you real-time insights and alerts for all your applications. No more blind spots, just full visibility and control.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-3xl mx-auto"> 

          <>
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex gap-2 bg-zinc-900/20 rounded-lg p-1 max-w-xl mx-auto overflow-hidden">
                {(Object.keys(codeExamples) as Languajes[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`flex-1 px-4 py-1 rounded-md font-medium transition-all capitalize text-sm ${
                      activeTab === lang
                        ? 'bg-zinc-800 shadow-sm'
                        : 'text-zinc-600  hover:text-zinc-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Code Block */}
              <div className="rounded-lg border border-zinc-900/30 overflow-hidden bg-zinc-900/10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-900/30 bg-zinc-900/10 px-4 py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="ml-3 text-xs font-mono text-zinc-600">
                      logsh.
                      {
                        activeTab === 'javascript' ? 'js' :
                        activeTab === 'typescript' ? 'ts' :
                        activeTab === 'python' ? 'py' :
                        activeTab === 'ruby' ? 'rb' :
                        activeTab === 'php' ? 'php' :
                        activeTab === 'go' ? 'go' :
                        activeTab === 'java' ? 'java' : ''
                        
                      }
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentCode)}
                    className="p-2 hover:bg-zinc-900/20 rounded-md transition-colors"
                    title="Copy code"
                  >
                    {
                      copied ? (
                        <span className="text-green-600 dark:text-green-400 font-medium text-[10px] block">
                          ✓ Copied!
                        </span>
                      ) : (
                        <Copy className="w-4 h-4 text-zinc-600" />
                      )
                    }
                  </button>
                </div>

                {/* Code Content */}
                <ScrollArea className="h-96">
                  <div className="p-4">
                    <pre className="font-mono text-xs text-zinc-300 leading-relaxed">
                      <code>
                        {currentCode}
                      </code>
                    </pre>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
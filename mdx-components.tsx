import type { MDXComponents } from 'mdx/types'
import { ScrollArea, ScrollBar } from './components/ui/scroll-area'
 
const components: MDXComponents = {
  h1: (props) => <h1 className="text-4xl! font-bold mb-6 mt-0!" {...props} />,
  h2: (props) => <h2 className="text-3xl! font-bold my-5" {...props} />,
  h3: (props) => <h3 className="text-2xl! font-bold my-4" {...props} />,
  strong: (props) => <strong className="text-sm font-semibold text-green-600" {...props} />,
  p: (props) => <p className="text-sm text-zinc-300 my-1 leading-6" {...props} />,
  pre: (props) => {
    return (
      <ScrollArea>
        <div className='rounded-md mt-6 p-8 py-10 border border-zinc-900/30 bg-zinc-900/20'>
          <pre {...props} className="bg-transparent! text-sm p-0! m-0!" />
        </div>
        <ScrollBar orientation='horizontal'/>
      </ScrollArea>
    )
  },
  div: (props) => <div className="text-sm text-zinc-300" {...props} />,
  table: (props) => {
    return (
      <ScrollArea>
        <div className='px-6 mt-6 bg-zinc-900/20 border border-zinc-900/30 rounded-lg overflow-auto'>
          <table className="w-full table-auto border-collapse my-0 min-w-xl" {...props} />
        </div>
        <ScrollBar orientation='horizontal'/>
      </ScrollArea>
    )
  }, 
  thead: (props) => <thead className="border-b border-zinc-900/30" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr : (props) => <tr className="py-4 w-full border-b border-zinc-900/10 last:border-b-0" {...props} />,
  td: (props) => <td className="py-4 pr-10 min-w-20 first:text-green-600 text-zinc-400 font-semibold " {...props} />,
  figcaption: (props) => <figcaption className="text-xs font-semibold text-zinc-700" {...props} />,
  li: (props) => <li className="text-sm text-zinc-300 my-1 leading-6" {...props} />
}
 
export function useMDXComponents(): MDXComponents {
  return components
}
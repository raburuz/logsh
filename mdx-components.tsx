import type { MDXComponents } from 'mdx/types'
import { cn } from './lib/utils'
 
const components: MDXComponents = {
/*   h1: (props) => <h1 className="text-4xl font-bold my-6" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold my-5" {...props} />,
  h3: (props) => <h3 className="text-2xl font-bold my-4" {...props} />,
  p: (props) => <p className="text-base my-2 leading-7" {...props} />,
  a: (props) => <a className="text-blue-600 underline" {...props} />, */
  
  h1: (props) => <h1 className="text-4xl! font-bold my-6" {...props} />,
  h2: (props) => <h2 className="text-3xl! font-bold my-5" {...props} />,
  h3: (props) => <h3 className="text-2xl! font-bold my-4" {...props} />,
  strong: (props) => <strong className="text-sm font-semibold text-green-600" {...props} />,
  p: (props) => <p className="text-sm text-zinc-300 my-1 leading-6" {...props} />,
  pre: (props) => <pre {...props} className="bg-zinc-900/10! border border-zinc-900/30 text-sm rounded-md overflow-x-auto mt-6 p-8 py-10" />,
  div: (props) => <div className="text-sm text-zinc-300" {...props} />,
  table: (props) => <div className='px-6 mt-6 bg-zinc-900/20 border border-zinc-900/30 rounded-lg'><table className="w-full table-auto border-collapse my-0" {...props} /></div>, 
  thead: (props) => <thead className="border-b border-zinc-900/30" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr : (props) => <tr className="py-4 w-full border-b border-zinc-900/10 last:border-b-0" {...props} />,
  td: (props) => <td className="py-4 pr-10 min-w-20 first:text-green-600 text-zinc-400 font-semibold " {...props} />,
  figcaption: (props) => <figcaption className="text-xs font-semibold text-zinc-700" {...props} />
}
 
export function useMDXComponents(): MDXComponents {
  return components
}
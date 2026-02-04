import type { MDXComponents } from 'mdx/types'
 
const components: MDXComponents = {
/*   h1: (props) => <h1 className="text-4xl font-bold my-6" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold my-5" {...props} />,
  h3: (props) => <h3 className="text-2xl font-bold my-4" {...props} />,
  p: (props) => <p className="text-base my-2 leading-7" {...props} />,
  a: (props) => <a className="text-blue-600 underline" {...props} />, */

  strong: (props) => <strong className="font-semibold text-white" {...props} />,
}
 
export function useMDXComponents(): MDXComponents {
  return components
}
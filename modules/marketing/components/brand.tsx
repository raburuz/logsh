import { SendHorizontal } from 'lucide-react'
import { config } from '@/modules/shared/config'


export const Brand = () => {
  return (
    <div className="flex items-center gap-2">
      <SendHorizontal className='w-5 h-5 text-white' />
      <span className="text-white font-bold text-lg">
        {config.app.name}
      </span>
    </div>
  )
} 

export const Logo = () => {
  return (
    <div>
      <SendHorizontal className='w-3 h-3' />
    </div>
  )
}

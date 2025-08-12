import React from 'react'
import { ArrowUp } from 'lucide-react'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface MoveUpProps {
  tweetIndex: number
  onMoveUp: (index: number) => void
  disabled?: boolean
}

const MoveUp = ({ tweetIndex, onMoveUp, disabled = false }: MoveUpProps) => {
  const handleMoveUp = () => {
    if (disabled) return
    onMoveUp(tweetIndex)
  }
  return (  
<main className='flex justify-center items-center'>
    <Tooltip>
        <TooltipTrigger>
            <div 
              className={`rounded-md p-1.5 transition-colors ${
                disabled 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-black/5 cursor-pointer'
              }`}
              onClick={handleMoveUp}
            >
                <ArrowUp className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-black'}`} />
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{disabled ? 'Already at top' : 'Move Up'}</p>
        </TooltipContent>
    </Tooltip>
</main>
  )
}

export default MoveUp
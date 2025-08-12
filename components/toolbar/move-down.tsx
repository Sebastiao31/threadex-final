import React from 'react'
import { ArrowDown } from 'lucide-react'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface MoveDownProps {
  tweetIndex: number
  onMoveDown: (index: number) => void
  disabled?: boolean
}

const MoveDown = ({ tweetIndex, onMoveDown, disabled = false }: MoveDownProps) => {
  const handleMoveDown = () => {
    if (disabled) return
    onMoveDown(tweetIndex)
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
              onClick={handleMoveDown}
            >
                <ArrowDown className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-black'}`} />
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{disabled ? 'Already at bottom' : 'Move Down'}</p>
        </TooltipContent>
    </Tooltip>
</main>
  )
}

export default MoveDown
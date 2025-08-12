import React from 'react'
import { BetweenHorizontalStart } from 'lucide-react'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface AddTweetSpaceProps {
  tweetIndex: number
  onAddTweet: (afterIndex: number) => void
}

const AddTweetSpace = ({ tweetIndex, onAddTweet }: AddTweetSpaceProps) => {
  const handleAddTweet = () => {
    onAddTweet(tweetIndex)
  }
  return (  
<main className='flex justify-center items-center'>
    <Tooltip>
        <TooltipTrigger>
            <div 
              className='hover:bg-[#1d9bf0]/5 rounded-md p-1.5 cursor-pointer transition-colors'
              onClick={handleAddTweet}
            >
                <BetweenHorizontalStart className='w-5 h-5 text-[#1d9bf0]' />
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>Add Tweet Below</p>
        </TooltipContent>
    </Tooltip>
</main>
  )
}

export default AddTweetSpace
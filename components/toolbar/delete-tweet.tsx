import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import CustomAlertDialog from '@/components/CostumAlertDialog'

interface DeleteTweetProps {
  tweetIndex: number
  onDelete: (index: number) => void
  disabled?: boolean
}

const DeleteTweet = ({ tweetIndex, onDelete, disabled = false }: DeleteTweetProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = () => {
    if (disabled) return
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete(tweetIndex)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }
  return (  
<>
<main className='flex justify-center items-center'>
    <Tooltip>
        <TooltipTrigger>
            <div 
              className={`rounded-md p-1.5 transition-colors ${
                disabled 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-red-600/5 cursor-pointer'
              }`}
              onClick={handleDelete}
            >
                <Trash2 className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-red-600'}`} />
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{disabled ? 'Cannot delete (minimum 1 tweet required)' : 'Delete Tweet'}</p>
        </TooltipContent>
    </Tooltip>
</main>

<CustomAlertDialog 
  isOpen={isDialogOpen}
  onClose={handleCloseDialog}
  onConfirm={handleConfirmDelete}
  title="Delete Tweet"
  description="Are you sure you want to delete this tweet? This action cannot be undone and will permanently remove the tweet from your thread."
  confirmText="Delete Tweet"
  cancelText="Cancel"
/>
</>
  )
}

export default DeleteTweet
import React from 'react'
import { Button } from './ui/button'
import { IconCoins, IconPlus } from '@tabler/icons-react'
import { Skeleton } from './ui/skeleton'

type CreditContainerProps = {
  loading?: boolean
  credits?: number
}

const CreditContainer: React.FC<CreditContainerProps> = ({ loading = false, credits = 100 }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-1 mb-4 p-1 border rounded-lg w-full justify-between mx-1">
        <div className="flex items-center gap-2 ml-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-1 mb-4 p-1 border rounded-lg w-full justify-between mx-1">
      <div className="flex items-center gap-2 ml-2">
        <IconCoins className="size-4" />
        <p className="text-sm font-medium">{credits}</p>
      </div>
      <div>
        <Button
          size="icon"
          className="size-8 group-data-[collapsible=icon]:opacity-0 bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          variant="outline"
        >
          <IconPlus />
          <span className="sr-only">Buy Credits</span>
        </Button>
      </div>
    </div>
  )
}

export default CreditContainer
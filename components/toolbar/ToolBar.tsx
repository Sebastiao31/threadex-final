import React from 'react'
import AddTweetSpace from './add-space-tweet'
import AddMedia from './add-media'
import AddGif from './add-gif'
import DeleteTweet from './delete-tweet'
import MoveDown from './move-down'
import MoveUp from './move-up'

interface ThreadsToolbarProps {
  tweetNumber: number
  characterCount: number
  currentIndex: number
  totalTweets: number
  tweetContent: string
  threadTopic: string
  onDeleteTweet: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onAddTweet: (afterIndex: number) => void
  onImageGenerated: (index: number, imageData: { url: string; prompt?: string }) => void
}

const ThreadsToolbar = ({ tweetNumber, characterCount, currentIndex, totalTweets, tweetContent, threadTopic, onDeleteTweet, onMoveUp, onMoveDown, onAddTweet, onImageGenerated }: ThreadsToolbarProps) => {
  const maxLength = 280
  const progress = (characterCount / maxLength) * 100
  const circumference = 2 * Math.PI * 8 // radius = 8
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Color logic like X/Twitter
  const getProgressColor = () => {
    if (characterCount > 280) return '#ef4444' // red
    if (characterCount > 260) return '#f59e0b' // amber/orange
    if (characterCount > 240) return '#eab308' // yellow
    return '#1d9bf0' // X/Twitter blue
  }

  const shouldShowCount = characterCount > 240
  
  // Logic for showing move components
  const isFirstTweet = currentIndex === 0
  const isLastTweet = currentIndex === totalTweets - 1
  const showMoveUp = !isFirstTweet
  const showMoveDown = !isLastTweet
  const canDelete = totalTweets > 1 // Don't allow deleting if only one tweet
  
  return (
    <main className="flex items-center gap-2 ">
        <div className="relative">
            {/* Circle character progress bar */}
            <svg width="20" height="20" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke={getProgressColor()}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 ease-out"
              />
            </svg>
            
            {/* Character count number (only show when approaching limit) */}
            {shouldShowCount && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-[10px] font-medium"
                  style={{ color: getProgressColor() }}
                >
                  {characterCount > 280 ? 280 - characterCount : ''}
                </span>
              </div>
            )}
        </div>

        <div className='ml-1'>
            <h1 className='font-medium text-gray-600'>#{tweetNumber}</h1>
        </div>
                  <div>
              <AddTweetSpace 
                tweetIndex={currentIndex}
                onAddTweet={onAddTweet}
              />
          </div>
        <div>
            <AddMedia/>
        </div>
        <div>
            <AddGif />
        </div>

        
    

        {/* Move controls - conditionally rendered based on position */}
                  {showMoveUp && (
              <div>
                  <MoveUp 
                    tweetIndex={currentIndex}
                    onMoveUp={onMoveUp}
                    disabled={isFirstTweet}
                  />
              </div>
          )}
          {showMoveDown && (
              <div>
                  <MoveDown 
                    tweetIndex={currentIndex}
                    onMoveDown={onMoveDown}
                    disabled={isLastTweet}
                  />
              </div>
          )}

                 <div>
             <DeleteTweet 
               tweetIndex={currentIndex}
               onDelete={onDeleteTweet}
               disabled={!canDelete}
             />
         </div>
    </main>
  )
}

export default ThreadsToolbar
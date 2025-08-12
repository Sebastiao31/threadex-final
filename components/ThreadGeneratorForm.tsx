"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { IconArrowUp, IconLoader2, IconViewportTall, IconWriting } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ThreadGeneratorForm = () => {

    const [topic, setTopic] = useState('')
    const [writingStyle, setWritingStyle] = useState('')
    const [threadLengthValue, setThreadLengthValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    // Button is only enabled when all three fields have values
    const isButtonDisabled = !topic.trim() || !writingStyle || !threadLengthValue || isLoading

    

    const handleGenerateThread = async () => {
      if (!topic.trim()) {
        setError('Please enter a topic for your thread')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const { data: userRes } = await supabase.auth.getUser()
        const uid = userRes.user?.id
        if (!uid) {
          throw new Error('You must be signed in')
        }

        const lengthNum = parseInt(threadLengthValue, 10)
        const resp = await fetch('/api/threads/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topic.trim(), writingStyle, length: lengthNum, uid }),
        })
        const json = await resp.json()
        if (!resp.ok) {
          throw new Error(json?.error || 'Failed to generate thread')
        }
        if (!json?.id) {
          throw new Error('Invalid response: missing id')
        }
        router.push(`/dashboard/threads/${json.id}`)
      } catch (err: any) {
        setError(err?.message || 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }


    const writingStyles = [
        { value: 'casual', label: 'Casual' },
        { value: 'professional', label: 'Professional' },
        { value: 'informative', label: 'Informative' },
        { value: 'entertaining', label: 'Entertaining' },
        { value: 'educational', label: 'Educational' },
        { value: 'motivational', label: 'Motivational' }
      ]

    const threadLength = [
        { value: 5, label: '5 Threads' },
        { value: 6, label: '6 Threads' },
        { value: 7, label: '7 Threads' },
        { value: 8, label: '8 Threads' },
        { value: 9, label: '9 Threads' },
        { value: 10, label: '10 Threads' }
    ]

  return (
    <div className="w-full max-w-2xl  mx-auto bg-[#FAFAFA] rounded-3xl border border-gray-200 p-2">
        <div>
            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic thread you want to create..."
                className="w-full p-3 text-sm resize-none focus:outline-none max-sm:text-sm placeholder-[#c8c8c8]"
                disabled={isLoading}
            />
        </div>

        <div className="flex items-center justify-between space-x-2 md:space-x-4">
            <div className="flex items-center">
                <div className="min-w-[120px] md:min-w-[160px] ">
                <Select value={writingStyle} onValueChange={setWritingStyle}>
                    <SelectTrigger className="w-full border-none text-black shadow-none hover:bg-[#f3f3f3] transition-all duration-200 cursor-pointer">
                    <IconWriting/>
                    <SelectValue placeholder="Writing Style" />
                    </SelectTrigger>
                    <SelectContent>
                    {writingStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                        {style.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>

                <div className="min-w-[120px] md:min-w-[160px] ">
                <Select value={threadLengthValue} onValueChange={setThreadLengthValue}>
                    <SelectTrigger className="w-full border-none text-black shadow-none hover:bg-[#f3f3f3] transition-all duration-200 cursor-pointer">
                    <IconViewportTall/>
                    <SelectValue placeholder="Thread Length" />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                        {threadLength.map((length) => (
                            <SelectItem key={length.value} value={length.value.toString()}>
                                {length.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
            </div>

            <div>
                <button 
                onClick={handleGenerateThread}
                disabled={isButtonDisabled}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                    isButtonDisabled 
                        ? 'bg-black/20 text-white cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-black/80 hover:cursor-pointer'
                }`}>
                    {isLoading ? <IconLoader2 className="animate-spin" /> : (
                        <IconArrowUp />
                    )}
                </button>
            </div>
        </div>
    </div>
  )
}

export default ThreadGeneratorForm
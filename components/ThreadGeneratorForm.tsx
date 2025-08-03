import React from 'react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { IconArrowUp, IconSend, IconViewportTall, IconWriting } from '@tabler/icons-react'

const ThreadGeneratorForm = () => {

    const writingStyles = [
        { value: 'casual', label: 'Casual' },
        { value: 'professional', label: 'Professional' },
        { value: 'informative', label: 'Informative' },
        { value: 'entertaining', label: 'Entertaining' },
        { value: 'educational', label: 'Educational' },
        { value: 'motivational', label: 'Motivational' }
      ]

  return (
    <div className="w-full max-w-2xl  mx-auto bg-[#FAFAFA] rounded-3xl border border-gray-200 p-2">
        <div>
            <textarea
                placeholder="Enter the topic thread you want to create..."
                className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none max-sm:text-sm placeholder-[#c8c8c8]"
            />
        </div>

        <div className="flex items-center justify-between space-x-2 md:space-x-4">
            <div className="flex items-center">
                <div className="min-w-[120px] md:min-w-[160px] ">
                <Select>
                    <SelectTrigger className="w-full border-none text-black shadow-none hover:bg-[#f3f3f3] transition-all duration-200">
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
                <Select>
                    <SelectTrigger className="w-full border-none text-black shadow-none hover:bg-[#f3f3f3] transition-all duration-200">
                    <IconViewportTall/>
                    <SelectValue placeholder="Thread Length" />
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
            </div>

            <div>
                <button className="bg-black text-white p-1.5 rounded-full hover:bg-black/80 hover:cursor-pointer">
                    <IconArrowUp/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ThreadGeneratorForm
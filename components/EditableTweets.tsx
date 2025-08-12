"use client"

import React, { useEffect, useRef, useState } from 'react'

type Props = {
  tweets: string[]
}

export default function EditableTweets({ tweets }: Props) {
  const [values, setValues] = useState<string[]>(() => tweets)
  const textareasRef = useRef<Array<HTMLTextAreaElement | null>>([])

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.overflow = 'hidden'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    // Initial resize
    textareasRef.current.forEach((el) => el && autoResize(el))
  }, [])

  const handleChange = (index: number, value: string) => {
    setValues((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="space-y-3">
      {values.map((text, i) => (
        <div key={i} className="rounded-lg p-0">
          <textarea
            ref={(el) => {
              textareasRef.current[i] = el
              if (el) autoResize(el)
            }}
            className="w-full resize-none overflow-hidden border-0 bg-transparent outline-none text-[15px] leading-relaxed"
            value={text}
            onChange={(e) => {
              handleChange(i, e.target.value)
              autoResize(e.currentTarget)
            }}
            onInput={(e) => autoResize(e.currentTarget)}
            placeholder="Write tweet…"
          />
          <div className={`text-right text-xs ${text.length > 280 ? 'text-red-600' : 'text-gray-400'}`}>{text.length}/280</div>
        </div>
      ))}
    </div>
  )
}


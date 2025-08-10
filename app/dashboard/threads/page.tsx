"use client"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

const page = () => {
  const [text, setText] = useState('Testing from Threadex ✅')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handlePost = async () => {
    try {
      setLoading(true)
      setResult(null)
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      const res = await fetch(`/api/twitter/post${uid ? `?uid=${encodeURIComponent(uid)}` : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: text }),
      })
      const json = await res.json()
      if (!res.ok) {
        const info = [json?.error, json?.details, json?.statusCode, json?.lookedUpBy, json?.filterValue]
          .filter(Boolean)
          .join(' | ')
        throw new Error(info || 'Failed to post')
      }
      setResult(`Posted as @${json.screen_name}. Tweet ID: ${json.tweet?.id_str || json.tweet?.id}`)
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3">
      <textarea
        className="w-full h-40 border rounded-md p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handlePost}
        disabled={loading}
        className="bg-blue-500 disabled:opacity-60 text-white p-2 rounded-md"
      >
        {loading ? 'Posting…' : 'Post test tweet'}
      </button>
      {result && <div className="text-sm text-gray-700">{result}</div>}
    </div>
  )
}

export default page
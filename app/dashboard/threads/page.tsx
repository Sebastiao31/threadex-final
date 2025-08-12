"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DataTable } from '@/components/data-table'

const page = () => {
  const [text, setText] = useState('Testing from Threadex ✅')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<Array<{ twitter_id: string; screen_name: string; name: string }>>([])
  const [selectedTwitterId, setSelectedTwitterId] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      if (!uid) return
      try {
        const res = await fetch(`/api/user/accounts?uid=${encodeURIComponent(uid)}`)
        if (res.ok) {
          const json = await res.json()
          const accs = (json.accounts || []) as Array<{ twitter_id: string; screen_name: string; name: string; isActive?: boolean }>
          setAccounts(accs)
          const active = accs.find(a => (a as any).isActive)
          setSelectedTwitterId(active ? String(active.twitter_id) : (accs[0] ? String(accs[0].twitter_id) : null))
        }
      } catch {}
    }
    run()
  }, [])

  const handlePost = async () => {
    try {
      setLoading(true)
      setResult(null)
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      const res = await fetch(`/api/twitter/post${uid ? `?uid=${encodeURIComponent(uid)}` : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: text, twitter_id: selectedTwitterId }),
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
    <div className=" space-y-3">
      
      <div className="mt-8">
        <DataTable data={[]} />
      </div>
      <textarea
        className="w-full h-40 border rounded-md p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <select
          className="border rounded-md p-2 text-sm"
          value={selectedTwitterId ?? ''}
          onChange={(e) => setSelectedTwitterId(e.target.value)}
        >
          {accounts.map(a => (
            <option key={a.twitter_id} value={a.twitter_id}>@{a.screen_name} — {a.name}</option>
          ))}
        </select>
        <button
          onClick={handlePost}
          disabled={loading || !selectedTwitterId}
          className="bg-blue-500 disabled:opacity-60 text-white p-2 rounded-md"
        >
          {loading ? 'Posting…' : 'Post test tweet'}
        </button>
      </div>
      {result && <div className="text-sm text-gray-700">{result}</div>}
    </div>
  )
}

export default page
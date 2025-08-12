import { supabaseAdmin } from '@/lib/supabaseAdmin'
import React from 'react'
import EditableTweets from '@/components/EditableTweets'

type ThreadRow = {
  id: string
  name: string
  writing_style: string
  status: string
  last_edit: string
  tweets: string[] | null
}

export default async function ThreadDetailPage({ params }: { params: { id: string } }) {
  const id = params.id

  const { data, error } = await supabaseAdmin
    .from('threads')
    .select('id, name, writing_style, status, last_edit, tweets')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Thread</h1>
        <p className="text-sm text-red-600 mt-2">Failed to load thread. {error.message}</p>
        <p className="text-xs text-gray-500 mt-1">You're on id: {id}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Thread not found</h1>
        <p className="text-xs text-gray-500 mt-1">You're on id: {id}</p>
      </div>
    )
  }

  const thread = data as ThreadRow
  const tweets = Array.isArray(thread.tweets) ? thread.tweets : []

  return (
    <div className="p-6 space-y-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{thread.name}</h1>
          <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
            <span>Style: {thread.writing_style}</span>
            <span className="text-gray-300">•</span>
            <span>Status: {thread.status}</span>
            <span className="text-gray-300">•</span>
            <span>Last edit: {new Date(thread.last_edit).toLocaleString()}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400">id: {thread.id}</span>
          </div>
        </div>

      
        <div className="max-w-[598px] mx-auto" >
            <EditableTweets tweets={tweets} />
        </div>
    </div>
  )
}


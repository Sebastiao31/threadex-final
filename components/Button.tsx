"use client"

import React from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Button = () => {
  const [name, setName] = React.useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return
      const fullName: string | undefined = (user.user_metadata as any)?.full_name
      const displayName: string | undefined = (user.user_metadata as any)?.display_name
      const avatar: string | undefined = (user.user_metadata as any)?.avatar_url
      const fallbackName = user.email ? user.email.split('@')[0] : 'User'
      setName(fullName || displayName || fallbackName)
      setAvatarUrl(avatar || null)
    }
    load()
  }, [])

  if (name) {
    return (
      <Link href="/dashboard" className="flex items-center gap-2 border border-[#f3f3f3] rounded-2xl px-3 py-2 hover:bg-[#f1f1f1]">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl ?? ''} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{name}</span>
      </Link>
    )
  }

  return (
    <Link href="/login" className="inline-block">
      <button className="bg-black text-white px-4 py-2 rounded-2xl border-4 border-[#e5e5e5] hover:cursor-pointer hover:bg-[#2A2A2A]">
        Try for FREE
      </button>
    </Link>
  )
}

export default Button
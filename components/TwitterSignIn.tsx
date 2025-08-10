"use client"

import React from 'react'
import { supabase } from '@/lib/supabase'

const TwitterSignIn = () => {
  const startTwitterLink = async () => {
    const { data } = await supabase.auth.getUser()
    const uid = data.user?.id
    const target = uid ? `/api/auth/request-token?uid=${encodeURIComponent(uid)}` : `/api/auth/request-token`
    window.location.href = target
  }

  return (
    <button onClick={startTwitterLink} className="bg-black text-white px-4 py-2 rounded-2xl border-4 border-[#e5e5e5] hover:cursor-pointer hover:bg-[#2A2A2A]">
      Add X Account
    </button>
  )
}

export default TwitterSignIn
  
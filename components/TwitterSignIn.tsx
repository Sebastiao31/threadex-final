import React from 'react'

const TwitterSignIn = () => {
  return (
    <a href="/api/auth/request-token" className="inline-block">
      <button className="bg-black text-white px-4 py-2 rounded-2xl border-4 border-[#e5e5e5] hover:cursor-pointer hover:bg-[#2A2A2A] transition-colors duration-200">
        Sign in with X
      </button>
    </a>
  )
}

export default TwitterSignIn
  
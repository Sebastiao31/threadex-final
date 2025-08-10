"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import TwitterSignIn from "./TwitterSignIn"

interface TwitterModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export default function TwitterModal({ isOpen, onClose, userName }: TwitterModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-7 w-7 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-4 7.25c0-.966 1.94-1.75 4-1.75s4 .784 4 1.75V17H8v-1.75Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Welcome{userName ? `, ${userName}` : ""}!</h2>
          <p className="mt-1 text-sm text-gray-600">You’re signed in and ready to create your next thread.</p>
        </div>
        <div className="mt-6 flex justify-center">
            <TwitterSignIn />
        </div>
      </div>
    </div>
  )
}


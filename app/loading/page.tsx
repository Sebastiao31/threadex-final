"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoadingPage() {
  const [status, setStatus] = useState('Setting up your account...')
  const router = useRouter()

  useEffect(() => {
    const setupUserSession = async () => {
      try {
        // Step 1: Check if we have the basic auth cookies
        setStatus('Verifying authentication...')
        await new Promise(resolve => setTimeout(resolve, 300))

        // Step 2: Fetch user profile to ensure data is available
        setStatus('Loading your profile...')
        const response = await fetch('/api/user/profile')
        
        if (!response.ok) {
          throw new Error('Failed to load user profile')
        }

        const userData = await response.json()
        
        if (!userData.name) {
          throw new Error('User data not complete')
        }

        // Step 3: All set, redirect to dashboard
        setStatus('Redirecting to dashboard...')
        await new Promise(resolve => setTimeout(resolve, 300))
        
        router.push('/dashboard')
      } catch (error) {
        console.error('Loading error:', error)
        setStatus('Something went wrong. Redirecting...')
        
        // Fallback: redirect anyway after a delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    }

    setupUserSession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
       
        
      </div>
    </div>
  )
} 
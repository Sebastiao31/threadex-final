"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoadingPage() {
  const [status, setStatus] = useState('Setting up your account...')
  const router = useRouter()

  useEffect(() => {
    const setupUserSession = async () => {
      try {
        // Verify Supabase session
        setStatus('Verifying authentication...')
        const { data } = await supabase.auth.getSession()
        if (!data.session) throw new Error('No active session')

        // Step 3: All set, redirect to dashboard
        setStatus('Redirecting to dashboard...')
        await new Promise(resolve => setTimeout(resolve, 300))
        
        router.push('/dashboard')
      } catch (error) {
        console.error('Loading error:', error)
        setStatus('Something went wrong. Redirecting...')
        
        // Fallback: redirect to login after a delay
        setTimeout(() => {
          router.push('/login')
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
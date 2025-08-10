'use client'
import ThreadGeneratorForm from "@/components/ThreadGeneratorForm"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import TwitterModal from "@/components/twitter-modal"
import { Skeleton } from "@/components/ui/skeleton"



export default function Page() {
  const [userName, setUserName] = useState<string>("")
  const [isAuthed, setIsAuthed] = useState<boolean>(false)
  const [showWelcome, setShowWelcome] = useState<boolean>(true)
  const [isLoadingName, setIsLoadingName] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (user) {
        setIsAuthed(true)

        // Prefer twitter_user.name or screen_name if available
        try {
          const response = await fetch(`/api/user/profile?uid=${encodeURIComponent(user.id)}`)
          if (response.ok) {
            const profile = await response.json()
            const twitterPreferredName: string = profile?.name || profile?.screen_name || "user"
            setUserName(twitterPreferredName)
          } else {
            setUserName("user")
          }
        } catch (err) {
          // Silently fall back to auth metadata name
          setUserName("user")
        } finally {
          setIsLoadingName(false)
        }
      } else {
        setIsAuthed(false)
        setIsLoadingName(false)
      }
    }
    load()

    // Re-fetch when active X account changes
    const onSwitched = () => {
      load()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('x-account-switched', onSwitched)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('x-account-switched', onSwitched)
      }
    }
  }, [])

  return (
    <>
      {/* Dashboard Content */}
      <div className="flex flex-col items-center h-full justify-center gap-4 pb-24 px-4 lg:gap-2 lg:px-6 max-sm:justify-between max-sm:pt-32 max-sm:pb-4">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col gap-2">
              {isLoadingName ? (
                <div className="flex items-center justify-center">
                  <Skeleton className="h-7 w-40" />
                </div>
              ) : (
                <h1 className="text-2xl font-semibold text-center">Hello, {userName} 👋🏼</h1>
              )}
              <p className="text-sm text-gray-500 text-center">
                  What thread do you want to create today?
              </p>
          </div>
        </div>

        <div className="mt-16 w-full">
          <ThreadGeneratorForm />
        </div>
      </div>
    </>
  )
}
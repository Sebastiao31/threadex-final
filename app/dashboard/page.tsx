'use client'
import ThreadGeneratorForm from "@/components/ThreadGeneratorForm"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import TwitterModal from "@/components/twitter-modal"



export default function Page() {
  const [userName, setUserName] = useState<string>("user")
  const [isAuthed, setIsAuthed] = useState<boolean>(false)
  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (user) {
        const fullName: string | undefined = (user.user_metadata as any)?.full_name
        const displayName: string | undefined = (user.user_metadata as any)?.display_name
        setUserName(fullName || displayName || "user")
        setIsAuthed(true)
      } else {
        setIsAuthed(false)
      }
    }
    load()
  }, [])

  return (
    <>
      {/* Dashboard Content */}
      <div className="flex flex-col items-center h-full justify-center gap-4 pb-24 px-4 lg:gap-2 lg:px-6 max-sm:justify-between max-sm:pt-32 max-sm:pb-4">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-center">Hello, {userName} 👋🏼</h1>
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
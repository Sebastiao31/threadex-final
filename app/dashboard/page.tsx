'use client'
import ThreadGeneratorForm from "@/components/ThreadGeneratorForm"
import DashboardSignIn from "@/components/DashboardSignIn"
import { useEffect, useState } from "react"

interface UserData {
  name: string
  screen_name: string
  profile_image_url: string
  email: string
}

export default function Page() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("user")
  const [showSignInModal, setShowSignInModal] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          setUserName(data.name)
          setShowSignInModal(false) // Hide modal if user is authenticated
        } else {
          // User is not authenticated
          setShowSignInModal(true)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setShowSignInModal(true) // Show modal on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <>
      {/* Sign In Modal */}
      <DashboardSignIn 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
      
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
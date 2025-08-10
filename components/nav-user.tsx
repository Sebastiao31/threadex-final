"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconSelector,
  IconPlus,
  IconBrandX,
  IconCoins,
  IconMail,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import CreditContainer from "./credit-container"

interface UserData {
  name: string
  screen_name: string
  profile_image_url: string
  email: string
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authInfo, setAuthInfo] = useState<{ name: string; email: string; avatar_url: string } | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }

        // Fetch signed-in auth user (Supabase auth.users)
        const { data: userRes } = await supabase.auth.getUser()
        const authUser = userRes.user
        if (authUser) {
          const fullName: string | undefined = (authUser.user_metadata as any)?.full_name
          const displayName: string | undefined = (authUser.user_metadata as any)?.display_name
          const avatarUrl: string | undefined = (authUser.user_metadata as any)?.avatar_url
          const email: string = authUser.email ?? ''
          const name = fullName || displayName || (email ? email.split('@')[0] : 'User')
          setAuthInfo({ name, email, avatar_url: avatarUrl || '' })
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <CreditContainer/>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData?.profile_image_url ?? ''} alt={userData?.name ?? 'User'} />
                <AvatarFallback className="rounded-lg">{(userData?.name ?? 'User').charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData?.name ?? 'No X User Connected'}</span>
                <span className="text-muted-foreground truncate text-xs">
                  @{userData?.screen_name ?? 'user'}
                </span>
              </div>
              <IconSelector className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData?.profile_image_url ?? ''} alt={userData?.name ?? 'User'} />
                  <AvatarFallback className="rounded-lg">{(userData?.name ?? 'User').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData?.name ?? 'No X User Connected'}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    @{userData?.screen_name ?? 'user'}
                  </span>
                </div>
              </div>

              
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            
              <DropdownMenuItem asChild>
                <a href="/api/auth/request-token" className="flex items-center gap-2">
                  <IconPlus />
                  Add<IconBrandX className="size-3 mx-[-4px]" />Account
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCoins />
                Buy Credits
              </DropdownMenuItem>
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel onClick={handleLogout} className="flex flex-col items-start gap-3">
              <div className="flex  gap-4 ">
                <span className="text-[2xs] text-muted-foreground font-normal">
                  Logged in as
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 rounded-full">
                    <AvatarImage src={authInfo?.avatar_url ?? ''} alt={authInfo?.name ?? 'User'} />
                    <AvatarFallback className="rounded-lg">{(authInfo?.name ?? 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-m font-medium">{authInfo?.name ?? 'User'}</span>
                  </div>
                </div>
                <button className="hover:bg-red-100 hover:text-red-500 hover:cursor-pointer rounded-sm  p-1" onClick={handleLogout}>
                  <IconLogout className="size-5" />
                </button>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

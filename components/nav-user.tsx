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
  const [accounts, setAccounts] = useState<Array<{ twitter_id: string; screen_name: string; name: string; profile_image_url: string; isActive: boolean }>>([])
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true)

  const handleAddXAccount = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.warn('[NavUser] supabase.auth.getUser error:', error)
      }
      const uid = data.user?.id
      if (!uid) {
        console.warn('[NavUser] No Supabase user id found; redirecting to login')
        router.push('/login')
        return
      }
      const target = `/api/auth/request-token?uid=${encodeURIComponent(uid)}`
      console.log('[NavUser] Redirecting to link X account:', target)
      window.location.href = target
    } catch (err) {
      console.error('[NavUser] Failed to start X linking flow:', err)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch signed-in auth user (Supabase auth.users) first
        const { data: userRes, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
          console.warn('[NavUser] supabase.auth.getUser error:', authErr)
        }
        const authUser = userRes.user
        if (authUser) {
          const fullName: string | undefined = (authUser.user_metadata as any)?.full_name
          const displayName: string | undefined = (authUser.user_metadata as any)?.display_name
          const avatarUrl: string | undefined = (authUser.user_metadata as any)?.avatar_url
          const email: string = authUser.email ?? ''
          const name = fullName || displayName || (email ? email.split('@')[0] : 'User')
          setAuthInfo({ name, email, avatar_url: avatarUrl || '' })

          // Now fetch linked X profile from our API using the Supabase uid
          try {
            const profileRes = await fetch(`/api/user/profile?uid=${encodeURIComponent(authUser.id)}`)
            if (profileRes.ok) {
              const data = await profileRes.json()
              setUserData(data)
            } else {
              setUserData(null)
            }
          } catch (e) {
            console.warn('[NavUser] Failed to fetch /api/user/profile:', e)
            setUserData(null)
          }

          // Fetch all connected accounts for switcher
          try {
            setLoadingAccounts(true)
            const accountsRes = await fetch(`/api/user/accounts?uid=${encodeURIComponent(authUser.id)}`)
            if (accountsRes.ok) {
              const json = await accountsRes.json()
              setAccounts(json.accounts || [])
            } else {
              setAccounts([])
            }
          } catch (e) {
            setAccounts([])
          } finally {
            setLoadingAccounts(false)
          }
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

  const handleSwitchAccount = async (twitterId: string) => {
    try {
      const { data: userRes } = await supabase.auth.getUser()
      const uid = userRes.user?.id
      if (!uid) return
      const res = await fetch(`/api/user/switch-account?uid=${encodeURIComponent(uid)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitter_id: twitterId }),
      })
      if (res.ok) {
        // Refresh accounts and profile
        const [profileRes, accountsRes] = await Promise.all([
          fetch(`/api/user/profile?uid=${encodeURIComponent(uid)}`),
          fetch(`/api/user/accounts?uid=${encodeURIComponent(uid)}`),
        ])
        if (profileRes.ok) setUserData(await profileRes.json())
        if (accountsRes.ok) {
          const json = await accountsRes.json()
          setAccounts(json.accounts || [])
        }

        // Notify rest of the app that active X account changed
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('x-account-switched', { detail: { twitterId } }))
          }
        } catch {}
      }
    } catch (e) {}
  }

  // Loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <CreditContainer loading />
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <CreditContainer loading={isLoading} />

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
              

              {/* Accounts list */}
              <div className="max-h-60 overflow-auto">
                {loadingAccounts ? (
                  <div className="px-1 py-1.5 text-xs text-muted-foreground">Loading accounts…</div>
                ) : accounts.length === 0 ? (
                  <div className="px-1 py-1.5 text-xs text-muted-foreground">No additional accounts</div>
                ) : (
                  accounts.map((acc) => (
                    <button
                      key={acc.twitter_id}
                      onClick={() => handleSwitchAccount(acc.twitter_id)}
                      className={`w-full flex items-center gap-2 mb-1 px-2 py-1.5 text-left text-sm rounded-md hover:cursor-pointer hover:bg-accent ${acc.isActive ? 'bg-accent' : ''}`}
                    >
                      <Avatar className="h-6 w-6 rounded-lg">
                        <AvatarImage src={acc.profile_image_url} alt={acc.name} />
                        <AvatarFallback className="rounded-lg">{acc.name?.charAt(0) ?? 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="truncate text-sm">{acc.name}</span>
                        <span className="text-muted-foreground truncate text-xs">@{acc.screen_name}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  handleAddXAccount()
                }}
                className="flex items-center gap-2"
              >
                <IconPlus />
                Add<IconBrandX className="size-3 mx-[-4px]" />Account
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

"use client"
import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  // Match /dashboard/threads/[id]
  const match = (pathname || '').match(/^\/dashboard\/threads\/([\w-]+)$/)
  const threadId = match?.[1]
  const [threadName, setThreadName] = React.useState<string>("")
  const [loadingName, setLoadingName] = React.useState<boolean>(false)

  React.useEffect(() => {
    const run = async () => {
      if (!threadId) {
        setThreadName("")
        setLoadingName(false)
        return
      }
      setLoadingName(true)
      try {
        const res = await fetch(`/api/threads/get?id=${encodeURIComponent(threadId)}`)
        if (res.ok) {
          const json = await res.json()
          setThreadName(json?.name || threadId)
        } else {
          setThreadName(threadId)
        }
      } catch {
        setThreadName(threadId)
      } finally {
        setLoadingName(false)
      }
    }
    run()
  }, [threadId])

  return (
    <header className={`flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)${threadId ? ' sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:rounded-t-xl overflow-hidden' : ''}`}>
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {threadId && (
          <>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard/threads">Threads</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {loadingName ? (
                    <Skeleton className="h-4 w-28" />
                  ) : (
                    <BreadcrumbPage>{threadName || 'Thread'}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
        <div className="ml-auto flex items-center gap-2" />
      </div>
      {threadId && <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />}
    </header>
  )
}

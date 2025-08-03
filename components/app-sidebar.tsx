"use client"

import * as React from "react"
import {
  IconChartBar,
  IconFolder,
  IconListDetails,
  IconNotes,
  IconClock,
  IconCalendar,
  IconTrendingUp,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Separator } from "./ui/separator"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Threads",
      url: "/dashboard/threads",
      icon: IconNotes,
    },
    {
      title: "Scheduled",
      url: "/dashboard/schedule",
      icon: IconClock,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: IconCalendar,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconTrendingUp,
    },
    
  ],
  
  
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className=" data-[slot=sidebar-menu-button]:!p-1 my-4 "
            >
              <a>
                <Image src="/images/Logo.png" alt="Threadex" width={32} height={32} />
                <span className="text-2xl font-semibold">Threadex</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

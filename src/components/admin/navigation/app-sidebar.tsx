"use client"

import * as React from "react"

import { NavMain } from "@/components/admin/navigation/nav-main"
import { NavUser } from "@/components/admin/navigation/nav-user"
import { adminRoutes } from "@/components/admin/navigation/routes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  HomeIcon,
  BadgePercentIcon,
  InboxIcon,
  ChartNoAxesCombinedIcon,
  PackageIcon,
  UsersRoundIcon,
  FlameIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react"

const routeIcons: Record<string, React.ReactNode> = {
  Home: <HomeIcon style={{"flexShrink":"0"}} />,
  Banners: <ImageIcon style={{"flexShrink":"0"}} />,
  "Creator Videos": <VideoIcon style={{"flexShrink":"0"}} />,
  Orders: <InboxIcon style={{"flexShrink":"0"}} />,
  Products: <PackageIcon style={{"flexShrink":"0"}} />,
  Customers: <UsersRoundIcon style={{"flexShrink":"0"}} />,
  "Deal of the day": <FlameIcon style={{"flexShrink":"0"}} />,
  Discounts: <BadgePercentIcon style={{"flexShrink":"0"}} />,
  Analytics: <ChartNoAxesCombinedIcon style={{"flexShrink":"0"}} />,
}

const navMain = adminRoutes.map((route) => ({
  title: route.label,
  url: route.href,
  icon: routeIcons[route.label],
  items: route.children?.map((child) => ({
    title: child.label,
    url: child.href,
  })),
}))

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" style={{"borderRightWidth":"1px","borderColor":"rgb(0,0,0,0.05)","backgroundColor":"rgb(235,235,235)","color":"rgb(48,48,48)"}} {...props}>
      <SidebarHeader style={{"paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingBottom":"0.625rem","paddingTop":"0.875rem"}}>
        <div style={{"display":"flex","flexDirection":"row","alignItems":"center","gap":"0.625rem","paddingLeft":"0.25rem","paddingRight":"0.25rem","paddingTop":"0.125rem","paddingBottom":"0.125rem"}}>
          <div style={{"display":"flex","flexShrink":"0","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","backgroundColor":"rgb(9,9,11)","color":"rgb(255,255,255)"}}>
            <span style={{"fontSize":"11px","fontWeight":"700","letterSpacing":"0.05em","color":"rgb(255,255,255)"}}>FA</span>
          </div>
          <div style={{"display":"none","minWidth":"0px","flex":"1 1 0%","flexDirection":"column","textAlign":"left","lineHeight":"1"}}>
            <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"13.5px","fontWeight":"600","letterSpacing":"-0.025em","color":"rgb(26,26,26)"}}>Favior</span>
            <span style={{"marginTop":"0.25rem","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"11px","fontWeight":"500","color":"rgb(112,112,112)"}}>
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent style={{"overflowY":"auto","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem"}}>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter style={{"padding":"0.5rem"}}>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


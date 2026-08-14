"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, CornerDownRight } from "lucide-react"

function isRouteActive(pathname: string, url: string) {
  if (url === "#") return false
  if (url === "/dashboard") return pathname === url
  return pathname === url || pathname.startsWith(`${url}/`)
}

function NavMainItem({
  item,
  pathname,
}: {
  item: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }
  pathname: string
}) {
  const routeActive =
    item.isActive ||
    isRouteActive(pathname, item.url) ||
    item.items?.some((subItem) => isRouteActive(pathname, subItem.url)) ||
    false
  const [open, setOpen] = React.useState(routeActive)

  React.useEffect(() => {
    setOpen(routeActive)
  }, [routeActive])
  const [hoveredSubIndex, setHoveredSubIndex] = React.useState<number | null>(null)

  if (item.items?.length) {
    return (
      <Collapsible
        key={item.title}
        asChild
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <SidebarMenuButton isActive={routeActive} tooltip={item.title}>
            <Link
              href={item.url}
              data-active={routeActive}
              style={{"display":"flex","flexDirection":"row","alignItems":"center","gap":"0.625rem","width":"100%","height":"2rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","fontSize":"13px","borderRadius":"0.5rem","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", ...(routeActive ? { backgroundColor: "rgb(255,255,255)", color: "#1a1a1a", fontWeight: 600, boxShadow: "0 1px 2px 0 rgb(0,0,0,0.05)" } : { color: "#303030", fontWeight: 500 })}}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub style={{"marginTop":"0.25rem","marginBottom":"0.25rem","display":"flex","flexDirection":"column","gap":"0.25rem","borderLeftWidth":"0px","paddingLeft":"0.875rem","paddingRight":"0.25rem"}}>
              {item.items.map((subItem) => {
                const isSubActive = isRouteActive(pathname, subItem.url)
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton isActive={isSubActive}>
                      <Link
                        href={subItem.url}
                        style={{"display":"flex","alignItems":"center","gap":"0.5rem","height":"2rem","paddingLeft":"0.5rem","paddingRight":"0.5rem","fontSize":"13px","borderRadius":"0.5rem","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", ...(isSubActive ? { backgroundColor: "rgb(0,0,0,0.05)", fontWeight: 500, color: "#1a1a1a" } : { color: "#555555", fontWeight: 400 })}}
                      >
                        <CornerDownRight style={{"width":"0.875rem","height":"0.875rem","color":"rgb(0,0,0,0.4)","flexShrink":"0","transitionProperty":"opacity","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", ...(isSubActive ? { opacity: 1 } : { opacity: 0.5 })}} />
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={routeActive} tooltip={item.title}>
        <Link
          href={item.url}
          data-active={routeActive}
          style={{"display":"flex","flexDirection":"row","alignItems":"center","gap":"0.625rem","width":"100%","height":"2rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","fontSize":"13px","borderRadius":"0.5rem","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", ...(routeActive ? { backgroundColor: "rgb(255,255,255)", color: "#1a1a1a", fontWeight: 600, boxShadow: "0 1px 2px 0 rgb(0,0,0,0.05)" } : { color: "#303030", fontWeight: 500 })}}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={`${item.title}-${pathname}`} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

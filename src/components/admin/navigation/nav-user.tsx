"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { authClient } from "@/lib/auth-client"
import { ChevronsUpDownIcon, LogOutIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const user = {
    name: session?.user?.name ?? "Favior Admin",
    email: session?.user?.email ?? "admin@favior.com",
    avatar: "",
  }
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleSignOut() {
    setIsSigningOut(true)
    await authClient.signOut()
    router.replace("/login")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","borderRadius":"0.75rem","padding":"0.375rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}>
          <Link
            href="/dashboard/profile"
            style={{"display":"flex","minWidth":"0px","flex":"1 1 0%","alignItems":"center","gap":"0.625rem"}}
            title="Edit Profile"
          >
            <div style={{"display":"flex","width":"2rem","height":"2rem","flexShrink":"0","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","backgroundColor":"rgb(26,26,26)","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} style={{"borderRadius":"0.5rem","objectFit":"cover","width":"100%","height":"100%"}} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div style={{"display":"flex","minWidth":"0px","flex":"1 1 0%","flexDirection":"column","textAlign":"left","lineHeight":"1.25"}}>
              <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"13px","fontWeight":"600","color":"rgb(10,122,230)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>
                {user.name}
              </span>
              <span style={{"marginTop":"0.125rem","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"11px","fontWeight":"400","color":"rgb(112,112,112)"}}>{user.email}</span>
            </div>
          </Link>

          <Link
            href="/dashboard/profile"
            title="Edit Profile"
            style={{"display":"flex","width":"2rem","height":"2rem","flexShrink":"0","cursor":"pointer","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(241,245,249)","color":"rgb(0,0,0)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
          >
            <UserIcon style={{"width":"0.875rem","height":"0.875rem"}} />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger
              disabled={isSigningOut}
              title="Log out"
              aria-label="Log out"
              style={{"display":"flex","width":"2rem","height":"2rem","flexShrink":"0","cursor":"pointer","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","color":"rgb(220,38,38)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
            >
              <LogOutIcon style={{"width":"0.875rem","height":"0.875rem"}} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your account and redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => void handleSignOut()}>
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

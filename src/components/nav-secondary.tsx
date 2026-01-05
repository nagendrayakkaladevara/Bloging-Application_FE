import React from "react"
import { type LucideIcon, Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "@/contexts/ThemeContext"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    badge?: React.ReactNode
    isActive?: boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const { resolvedColorMode, setColorMode } = useTheme();

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links (both desktop and mobile)
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const handleThemeToggle = () => {
    setColorMode(resolvedColorMode === "dark" ? "light" : "dark");
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                {item.url.startsWith("/") ? (
                  <Link to={item.url} onClick={handleLinkClick}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <a href={item.url} onClick={(e) => { if (item.url === "#") e.preventDefault(); }}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                )}
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleThemeToggle}>
              {resolvedColorMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{resolvedColorMode === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

import React from "react"
import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

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
  const { setOpen } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links
    setOpen(false);
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
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

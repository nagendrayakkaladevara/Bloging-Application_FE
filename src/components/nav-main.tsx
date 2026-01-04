import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    badge?: React.ReactNode
  }[]
}) {
  const { setOpen } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links
    setOpen(false);
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem 
          key={item.title}
          className={item.title === "Search" ? "border-b border-sidebar-border pb-2 mb-2" : ""}
        >
          <SidebarMenuButton 
            asChild 
            isActive={item.isActive}
            className={item.title === "Search" ? "border border-sidebar-border" : ""}
          >
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
  )
}

import React from "react"
import { type LucideIcon, Moon, Sun, Monitor } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

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
  const { colorMode, setColorMode } = useTheme();

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links (both desktop and mobile)
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  // Separate Settings and Help from other items
  const settingsItem = items.find(item => item.title === "Settings");
  const helpItem = items.find(item => item.title === "Help");
  const otherItems = items.filter(item => item.title !== "Settings" && item.title !== "Help");

  const themeModes: Array<{ mode: "system" | "light" | "dark"; icon: typeof Monitor; label: string }> = [
    { mode: "system", icon: Monitor, label: "System" },
    { mode: "light", icon: Sun, label: "Light" },
    { mode: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Other items (like Calendar) */}
          {otherItems.map((item) => (
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
          
          {/* Settings | Help | Theme buttons in a horizontal row */}
          <SidebarMenuItem>
            <div className="flex items-stretch gap-0.5 rounded-md overflow-hidden bg-sidebar-accent/30 p-0.5">
              {/* Settings */}
              {settingsItem && (
                <SidebarMenuButton 
                  asChild 
                  isActive={settingsItem.isActive} 
                  className={cn(
                    "rounded-md",
                    isMobile ? "flex-1 min-w-0" : "h-8 w-8 p-0"
                  )}
                  tooltip={!isMobile ? settingsItem.title : undefined}
                >
                  {settingsItem.url.startsWith("/") ? (
                    <Link to={settingsItem.url} onClick={handleLinkClick} className="flex items-center justify-center gap-1.5">
                      <settingsItem.icon className="h-4 w-4 shrink-0" />
                      {isMobile && <span className="truncate text-xs">{settingsItem.title}</span>}
                    </Link>
                  ) : (
                    <a 
                      href={settingsItem.url} 
                      onClick={(e) => { if (settingsItem.url === "#") e.preventDefault(); }}
                      className="flex items-center justify-center gap-1.5"
                    >
                      <settingsItem.icon className="h-4 w-4 shrink-0" />
                      {isMobile && <span className="truncate text-xs">{settingsItem.title}</span>}
                    </a>
                  )}
                </SidebarMenuButton>
              )}
              
              {/* Help */}
              {helpItem && (
                <SidebarMenuButton 
                  asChild 
                  isActive={helpItem.isActive} 
                  className={cn(
                    "rounded-md",
                    isMobile ? "flex-1 min-w-0" : "h-8 w-8 p-0"
                  )}
                  tooltip={!isMobile ? helpItem.title : undefined}
                >
                  {helpItem.url.startsWith("/") ? (
                    <Link to={helpItem.url} onClick={handleLinkClick} className="flex items-center justify-center gap-1.5">
                      <helpItem.icon className="h-4 w-4 shrink-0" />
                      {isMobile && <span className="truncate text-xs">{helpItem.title}</span>}
                    </Link>
                  ) : (
                    <a 
                      href={helpItem.url} 
                      onClick={(e) => { if (helpItem.url === "#") e.preventDefault(); }}
                      className="flex items-center justify-center gap-1.5"
                    >
                      <helpItem.icon className="h-4 w-4 shrink-0" />
                      {isMobile && <span className="truncate text-xs">{helpItem.title}</span>}
                    </a>
                  )}
                </SidebarMenuButton>
              )}
              
              {/* Theme buttons */}
              <div className="flex items-center gap-0.5">
                {themeModes.map((theme) => {
                  const Icon = theme.icon;
                  const isActive = colorMode === theme.mode;
                  return (
                    <button
                      key={theme.mode}
                      onClick={() => setColorMode(theme.mode)}
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-md transition-all",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/70"
                      )}
                      title={theme.label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

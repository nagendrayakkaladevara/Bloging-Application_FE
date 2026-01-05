import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSearch } from "@/contexts/SearchContext";

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
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const { openSearch } = useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links (both desktop and mobile)
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  // Detect if user is on Mac
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleSearchClick = () => {
    openSearch();
    // Close sidebar on mobile when opening search
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        // Render search input for Search item
        if (item.title === "Search") {
          return (
            <SidebarMenuItem 
              key={item.title}
              className="border-b border-sidebar-border pb-2 mb-2"
            >
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60 pointer-events-none z-10" />
                <SidebarInput
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-20 border border-sidebar-border w-full cursor-pointer"
                  readOnly
                  onClick={handleSearchClick}
                  onFocus={handleSearchClick}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <kbd className="hidden md:inline-flex h-5 select-none items-center justify-center gap-1 rounded border border-sidebar-border bg-sidebar px-1.5 font-mono text-[10px] font-medium text-sidebar-foreground/60 opacity-100">
                    {isMac ? (
                      <>
                        <span>⌘</span>
                        <span>K</span>
                      </>
                    ) : (
                      <>
                        <span>Ctrl</span>
                        <span>K</span>
                      </>
                    )}
                  </kbd>
                </div>
              </div>
            </SidebarMenuItem>
          );
        }

        // Render normal menu items for others
        return (
          <SidebarMenuItem 
            key={item.title}
          >
            <SidebarMenuButton 
              asChild 
              isActive={item.isActive}
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
        );
      })}
    </SidebarMenu>
  )
}

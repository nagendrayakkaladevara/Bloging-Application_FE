import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

/**
 * Calculate max character length based on sidebar width
 * Mobile: 18rem (288px), Desktop: 14rem (224px)
 * Accounting for: margin (mx-3.5 = 0.875rem each side), padding (px-2.5 + px-2), emoji (~1rem), gap (0.5rem)
 * Average character width in text-sm: ~0.45rem
 */
function getMaxTextLength(isMobile: boolean): number {
  // Sidebar widths in rem
  const SIDEBAR_WIDTH_MOBILE = 18; // rem
  const SIDEBAR_WIDTH_DESKTOP = 14; // rem
  
  const sidebarWidth = isMobile ? SIDEBAR_WIDTH_MOBILE : SIDEBAR_WIDTH_DESKTOP;
  
  // Space taken by non-text elements (in rem)
  // mx-3.5 = 0.875rem margin on each side = 1.75rem total
  const margin = 0.875 * 2; 
  // px-2.5 = 0.625rem padding on each side = 1.25rem total (submenu)
  const submenuPadding = 0.625 * 2; 
  // px-2 = 0.5rem padding on each side = 1rem total (button)
  const buttonPadding = 0.5 * 2; 
  const emoji = 1; // emoji width (~1rem)
  const gap = 0.5; // gap-2 between emoji and text
  
  // Available space for text
  const availableWidth = sidebarWidth - margin - submenuPadding - buttonPadding - emoji - gap;
  
  // Average character width in text-sm
  // Use smaller width for mobile to allow more characters (mobile has more space)
  const avgCharWidth = isMobile ? 0.4 : 0.45;
  
  // Calculate max characters, subtract 2 for ellipsis (reduced for mobile)
  const ellipsisBuffer = isMobile ? 2 : 3;
  const maxChars = Math.floor(availableWidth / avgCharWidth) - ellipsisBuffer;
  
  return Math.max(maxChars, 10); // Minimum 10 characters
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number = 15): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function NavWorkspaces({
  workspaces,
  className,
}: {
  workspaces: {
    name: string
    emoji: React.ReactNode
    pages: {
      name: string
      emoji: React.ReactNode
      url?: string
    }[]
  }[]
  className?: string
}) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links (both desktop and mobile)
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <Collapsible key={workspace.name}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <span>{workspace.emoji}</span>
                    <span>{workspace.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 ease-out data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <SidebarMenuSub>
                    {workspace.pages.map((page, index) => (
                      <motion.div
                        key={page.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.15, 
                          delay: index * 0.02,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            {page.url && page.url.startsWith("/") ? (
                              <Link to={page.url} title={page.name} onClick={handleLinkClick}>
                                <span>{page.emoji}</span>
                                <span className="truncate">{truncateText(page.name, getMaxTextLength(isMobile))}</span>
                              </Link>
                            ) : (
                              <a href={page.url || "#"} onClick={(e) => { if (!page.url || page.url === "#") e.preventDefault(); }} title={page.name}>
                                <span>{page.emoji}</span>
                                <span className="truncate">{truncateText(page.name, getMaxTextLength(isMobile))}</span>
                              </a>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </motion.div>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

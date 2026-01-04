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
  const { setOpen } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links
    setOpen(false);
  };

  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
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
                                <span className="truncate">{truncateText(page.name, 15)}</span>
                              </Link>
                            ) : (
                              <a href={page.url || "#"} onClick={(e) => { if (!page.url || page.url === "#") e.preventDefault(); }} title={page.name}>
                                <span>{page.emoji}</span>
                                <span className="truncate">{truncateText(page.name, 40)}</span>
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

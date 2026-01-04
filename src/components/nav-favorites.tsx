import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  StarOff,
  Check,
} from "lucide-react"
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number = 15): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function NavFavorites({
  favorites,
}: {
  favorites: {
    name: string
    url: string
    emoji: string
  }[]
}) {
  const { isMobile, setOpen } = useSidebar()
  const { removeFavorite } = useFavorites()
  const [feedback, setFeedback] = useState<{ [key: string]: "copied" | "removed" | null }>({});

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links
    setOpen(false);
  };

  // Extract blog ID from URL (format: /blog/{id})
  const getBlogIdFromUrl = (url: string): string | null => {
    const match = url.match(/^\/blog\/(.+)$/);
    return match ? match[1] : null;
  };

  const handleRemoveFavorite = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    const blogId = getBlogIdFromUrl(url);
    if (blogId) {
      removeFavorite(blogId);
      // Show feedback
      setFeedback(prev => ({ ...prev, [url]: "removed" }));
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, [url]: null }));
      }, 2000);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      // Show feedback
      setFeedback(prev => ({ ...prev, [url]: "copied" }));
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, [url]: null }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleOpenInNewTab = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Show only first 5 favorites
  const displayedFavorites = favorites.slice(0, 5);
  const hasMore = favorites.length > 5;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {displayedFavorites.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              {item.url.startsWith("/") ? (
                <Link to={item.url} title={item.name} onClick={handleLinkClick}>
                  <span>{item.emoji}</span>
                  <span className="truncate">{truncateText(item.name, 15)}</span>
                </Link>
              ) : (
                <a href={item.url} title={item.name}>
                  <span>{item.emoji}</span>
                  <span className="truncate">{truncateText(item.name, 15)}</span>
                </a>
              )}
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem 
                  className="gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
                  onClick={(e) => handleRemoveFavorite(e, item.url)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {feedback[item.url] === "removed" ? (
                    <>
                      <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-500">Removed</span>
                    </>
                  ) : (
                    <>
                      <StarOff className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                      <span className="text-sm font-medium">Remove from Favorites</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem 
                  className="gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
                  onClick={(e) => handleCopyLink(e, item.url)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {feedback[item.url] === "copied" ? (
                    <>
                      <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                      <span className="text-sm font-medium">Copy Link</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
                  onClick={(e) => handleOpenInNewTab(e, item.url)}
                  onSelect={(e) => e.preventDefault()}
                >
                  <ArrowUpRight className="h-4 w-4 text-foreground/70" />
                  <span className="text-sm font-medium">Open in New Tab</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

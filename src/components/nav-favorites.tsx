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
  const { isMobile, setOpen, setOpenMobile } = useSidebar()
  const { removeFavorite } = useFavorites()
  const [feedback, setFeedback] = useState<{ [key: string]: "copied" | "removed" | null }>({});

  const handleLinkClick = () => {
    // Close sidebar when clicking on internal links (both desktop and mobile)
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  // Extract blog ID from URL (format: /blog/{id})
  const getBlogIdFromUrl = (url: string): string | null => {
    const match = url.match(/^\/blog\/(.+)$/);
    return match ? match[1] : null;
  };

  const handleRemoveFavorite = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
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
    e.nativeEvent.stopImmediatePropagation();
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
    e.nativeEvent.stopImmediatePropagation();
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
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                alignOffset={-4}
              >
                <DropdownMenuItem 
                  onClick={(e) => handleRemoveFavorite(e, item.url)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {feedback[item.url] === "removed" ? (
                    <>
                      <Check className="h-4 w-4 text-foreground" />
                      <span className="text-sm text-foreground">Removed</span>
                    </>
                  ) : (
                    <>
                      <StarOff className="h-4 w-4" />
                      <span className="text-sm">Remove from Favorites</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => handleCopyLink(e, item.url)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {feedback[item.url] === "copied" ? (
                    <>
                      <Check className="h-4 w-4 text-foreground" />
                      <span className="text-sm text-foreground">Copied</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4" />
                      <span className="text-sm">Copy Link</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleOpenInNewTab(e, item.url)}
                  onSelect={(e) => e.preventDefault()}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm">Open in New Tab</span>
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

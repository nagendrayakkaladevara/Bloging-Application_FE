/**
 * AppSidebar Component
 * 
 * Main sidebar with blog catalogue navigation.
 * Based on shadcn sidebar-10 design.
 */

import * as React from "react";
import {
  Search,
  Sparkles,
  Home,
  Calendar,
  Settings2,
  MessageCircleQuestion,
  BookOpen,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { BlogPreview } from "@/types/blog";
import { Command } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { getBlogPreviewsByIds } from "@/data/mockBlogs";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  blogs: BlogPreview[];
}

export function AppSidebar({ blogs, ...props }: AppSidebarProps) {
  const location = useLocation();
  const { favorites: favoriteIds } = useFavorites();
  const { isMobile, setOpenMobile } = useSidebar();

  // Get favorite blogs from localStorage
  const favoriteBlogs = React.useMemo(() => {
    if (favoriteIds.length === 0) return [];
    return getBlogPreviewsByIds(favoriteIds);
  }, [favoriteIds]);

  // Convert favorite blogs to favorites format
  const favorites = favoriteBlogs.map((blog) => ({
    name: blog.meta.title,
    url: `/blog/${blog.id}`,
    emoji: "⭐",
  }));

  // Group blogs by category/tags for workspaces
  const workspaces = [
    {
      name: "All Blogs",
      emoji: "📚",
      pages: blogs.map((blog) => ({
        name: blog.meta.title,
        emoji: "📄",
        url: `/blog/${blog.id}`,
      })),
    },
    ...(blogs.length > 0
      ? [
          {
            name: "Recent Posts",
            emoji: "🕒",
            pages: blogs.slice(0, 5).map((blog) => ({
              name: blog.meta.title,
              emoji: "📄",
              url: `/blog/${blog.id}`,
            })),
          },
        ]
      : []),
  ];

  const navMain = [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
      badge: "Coming soon",
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: location.pathname === "/",
    },
    {
      title: "Blogs",
      url: "/#blogs",
      icon: BookOpen,
      isActive: location.pathname.startsWith("/blog"),
    },
  ];

  const navSecondary = [
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      isActive: location.pathname === "/calendar",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      isActive: location.pathname === "/settings",
    },
    {
      title: "Help",
      url: "/help",
      icon: MessageCircleQuestion,
      isActive: location.pathname === "/help",
    },
  ];

  const teams = [
    {
      name: "Blog Platform",
      logo: Command,
      plan: "Production",
    },
  ];

  return (
    <Sidebar className="border-r-0" collapsible="offcanvas" {...props}>
      <SidebarHeader className="relative">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => setOpenMobile(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <TeamSwitcher teams={teams} />
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        {favorites.length > 0 && <NavFavorites favorites={favorites} />}
        {workspaces.length > 0 && <NavWorkspaces workspaces={workspaces} className="-mt-2" />}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}


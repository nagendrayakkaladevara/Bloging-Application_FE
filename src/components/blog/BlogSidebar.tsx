/**
 * BlogSidebar Component
 * 
 * Sidebar for blog detail page containing:
 * - Table of Contents
 * - Navigation
 * - Blog metadata
 */

import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { Blog } from "@/types/blog";
import { Home, Calendar, Clock, User } from "lucide-react";
import { SocialShare } from "./SocialShare";
import { cn } from "@/lib/utils";

interface BlogSidebarProps {
  blog: Blog;
  headings: Array<{ id: string; level: number; text: string }>;
}

export function BlogSidebar({ blog, headings }: BlogSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const showTOC = blog.layout.showTableOfContents && headings.length > 0;

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Home />
                <span>Back to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Blog Metadata */}
        <SidebarGroup>
          <SidebarGroupLabel>Blog Info</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{blog.meta.author}</span>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatDate(blog.meta.publishedAt)}
                  </span>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {blog.meta.readTime} min read
                  </span>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Table of Contents */}
        {showTOC && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
              <SidebarGroupContent>
                <nav className="px-2">
                  <ul className="space-y-2">
                    {headings.map((heading) => {
                      const handleClick = (
                        e: React.MouseEvent<HTMLAnchorElement>
                      ) => {
                        e.preventDefault();
                        const element = document.getElementById(
                          `heading-${heading.id}`
                        );
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      };

                      return (
                        <li key={heading.id}>
                          <a
                            href={`#heading-${heading.id}`}
                            onClick={handleClick}
                            className={cn(
                              "text-sm text-muted-foreground hover:text-foreground transition-colors block",
                              heading.level === 1 && "font-medium",
                              heading.level === 2 && "ml-2",
                              heading.level === 3 && "ml-4",
                              heading.level === 4 && "ml-6",
                              heading.level === 5 && "ml-8",
                              heading.level === 6 && "ml-10"
                            )}
                          >
                            {heading.text}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Social Share */}
        {blog.settings.enableSocialShare && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Share</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-2">
                  <SocialShare
                    socialShare={blog.socialShare}
                    url={window.location.href}
                    title={blog.meta.title}
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}


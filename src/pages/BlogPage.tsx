/**
 * BlogPage Component
 * 
 * Renders a single blog with all its features:
 * - Blog content (blocks)
 * - Voting (if enabled)
 * - Social Share (if enabled)
 * - Tags and metadata
 * - Sidebar with TOC and metadata
 */

import { useParams, Link } from "react-router-dom";
import type { Blog } from "@/types/blog";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { Voting } from "@/components/blog/Voting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar, Clock, User, X, Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface BlogPageProps {
  blog: Blog | null;
  onVote?: (blogId: string, vote: "upvote" | "downvote") => void;
}

export function BlogPage({ blog, onVote }: BlogPageProps) {
  const { blogId } = useParams<{ blogId: string }>();
  const { open, toggleSidebar } = useSidebar();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleVote = (vote: "upvote" | "downvote") => {
    if (onVote && blogId) {
      onVote(blogId, vote);
    }
  };

  const handleFavoriteToggle = () => {
    if (blogId) {
      toggleFavorite(blogId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Blog Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The blog you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button variant="outline">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {!open ? (
          <SidebarTrigger className="-ml-1" aria-label="Open sidebar" />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 -ml-1"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{blog.meta.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Cover Image */}
        {blog.meta.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.meta.coverImage}
              alt={blog.meta.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">{blog.meta.title}</h1>
          </div>
          {blogId && (
            <Button
              variant="outline"
              onClick={handleFavoriteToggle}
              aria-label={isFavorite(blogId) ? "Remove from favorites" : "Add to favorites"}
              className="rounded-full mb-6"
            >
              <Star
                className={`h-4 w-4 mr-2 ${
                  isFavorite(blogId)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
              {isFavorite(blogId) ? "Remove from favorites" : "Add to favorites"}
            </Button>
          )}
          <p className="text-xl text-muted-foreground mb-6">{blog.meta.description}</p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.meta.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(blog.meta.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blog.meta.readTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Links */}
          {blog.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.type === "external" ? "_blank" : undefined}
                  rel={link.type === "external" ? "noopener noreferrer" : undefined}
                  className="text-sm text-primary hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Voting */}
        {blog.settings.enableVoting && (
          <Voting voting={blog.voting} onVote={handleVote} />
        )}

        {/* Blog Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <BlogRenderer blog={blog} />
        </div>

        </div>
      </div>
    </SidebarInset>
  );
}


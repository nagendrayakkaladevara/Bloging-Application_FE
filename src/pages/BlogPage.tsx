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
import * as React from "react";
import type { Blog } from "@/types/blog";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { Voting } from "@/components/blog/Voting";
import { Comments } from "@/components/blog/Comments";
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
import { Calendar, Clock, X, Star, ArrowUpRight, Link as LinkIcon, Copy, Check, Tag } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { motion } from "framer-motion";

interface BlogPageProps {
  blog: Blog | null;
  onVote?: (blogId: string, vote: "upvote" | "downvote") => void;
}

export function BlogPage({ blog, onVote }: BlogPageProps) {
  const { blogId } = useParams<{ blogId: string }>();
  const { open, toggleSidebar } = useSidebar();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [copiedLinkIndex, setCopiedLinkIndex] = React.useState<number | null>(null);
  const [votingState, setVotingState] = React.useState(blog?.voting);

  // Update voting state when blog changes
  React.useEffect(() => {
    if (blog) {
      setVotingState(blog.voting);
    }
  }, [blog]);

  const handleVoteChange = React.useCallback((newVoting: typeof blog.voting) => {
    // Only update if values actually changed to prevent unnecessary re-renders
    setVotingState((prev) => {
      if (
        prev?.upvotes !== newVoting.upvotes ||
        prev?.downvotes !== newVoting.downvotes ||
        prev?.userVote !== newVoting.userVote ||
        prev?.enabled !== newVoting.enabled
      ) {
        return newVoting;
      }
      return prev;
    });
    if (onVote && blogId) {
      // Keep the old onVote handler for backward compatibility
      // The actual voting is handled by the Voting component via API
    }
  }, [onVote, blogId]);

  const handleFavoriteToggle = () => {
    if (blogId) {
      toggleFavorite(blogId);
    }
  };

  const handleCopyLink = async (url: string, index: number) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLinkIndex(index);
      setTimeout(() => {
        setCopiedLinkIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
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
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">

        {/* Cover Image */}
        {blog.meta.coverImage && (
          <motion.div 
            className="mb-12 rounded-xl overflow-hidden shadow-lg border-2 border-border"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img
              src={blog.meta.coverImage}
              alt={blog.meta.title}
              className="w-full h-64 md:h-[32rem] object-cover"
            />
          </motion.div>
        )}

        {/* Header */}
        <header className="mb-12">
          {/* Title */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              {blog.meta.title}
            </motion.h1>
          </motion.div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">{blog.meta.description}</p>

          {/* Meta Information - Date, ReadTime, Tags (one line on desktop) */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:gap-4 mb-10 pb-8 border-b border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {/* Mobile: Date and ReadTime */}
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-4 md:hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Date - Simple text style */}
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.meta.publishedAt)}</span>
              </motion.div>

              {/* ReadTime - Simple text style */}
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <Clock className="h-4 w-4" />
                <span>{blog.meta.readTime} min read</span>
              </motion.div>
            </motion.div>

            {/* Desktop: Date, ReadTime, Tags in one line */}
            <motion.div
              className="hidden md:flex items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              {/* Date - Simple text style */}
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.meta.publishedAt)}</span>
              </motion.div>

              {/* ReadTime - Simple text style */}
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Clock className="h-4 w-4" />
                <span>{blog.meta.readTime} min read</span>
              </motion.div>

              {/* Tags - Badge style */}
              {blog.tags.length > 0 && blog.tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                >
                  <Badge
                    variant="secondary"
                    className="rounded-full py-1 px-3 border-border hover:bg-accent transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1.5" />
                    <span className="text-xs font-medium">{tag}</span>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: Tags (keep current mobile view) */}
            {blog.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 md:hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {blog.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + (index * 0.05) }}
                  >
                    <Badge
                      variant="secondary"
                      className="rounded-full py-1 px-3 border-border hover:bg-accent transition-colors"
                    >
                      <Tag className="h-3 w-3 mr-1.5" />
                      <span className="text-xs font-medium">{tag}</span>
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Voting, Favorite, and Links - One line on desktop */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:gap-4 mb-12 pb-8 border-b border-border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Mobile: Voting and Favorite Button (keep current mobile view) */}
            <motion.div
              className="flex items-center justify-between mb-4 md:hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Voting Section - Left */}
              {blog.settings.enableVoting && votingState ? (
                <Voting voting={votingState} blogSlug={blogId || ""} onVoteChange={handleVoteChange} />
              ) : (
                <div />
              )}

              {/* Favorite Button - Right */}
              {blogId && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleFavoriteToggle}
                    aria-label={isFavorite(blogId) ? "Remove from favorites" : "Add to favorites"}
                    className="rounded-full text-sm"
                    size="sm"
                  >
                    <motion.div
                      key={isFavorite(blogId) ? "filled" : "unfilled"}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 25,
                        duration: 0.4 
                      }}
                    >
                      <Star
                        className={`h-3 w-3 mr-1.5 ${
                          isFavorite(blogId)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>
                    <span>
                      {isFavorite(blogId) ? "Remove" : "Add"}
                    </span>
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Desktop: Voting, Favorite, and Links in one line */}
            <motion.div
              className="hidden md:flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Voting Section */}
              {blog.settings.enableVoting && votingState && (
                <Voting voting={votingState} blogSlug={blogId || ""} onVoteChange={handleVoteChange} />
              )}

              {/* Favorite Button */}
              {blogId && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleFavoriteToggle}
                    aria-label={isFavorite(blogId) ? "Remove from favorites" : "Add to favorites"}
                    className="rounded-full text-base"
                    size="sm"
                  >
                    <motion.div
                      key={isFavorite(blogId) ? "filled" : "unfilled"}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 25,
                        duration: 0.4 
                      }}
                    >
                      <Star
                        className={`h-4 w-4 mr-2 ${
                          isFavorite(blogId)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>
                    <span>
                      {isFavorite(blogId) ? "Remove" : "Add"}
                    </span>
                  </Button>
                </motion.div>
              )}

              {/* Links */}
              {blog.links.length > 0 && blog.links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.3 + (index * 0.05),
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <div className="inline-flex items-center rounded-full border border-input bg-background hover:bg-accent transition-colors overflow-hidden relative">
                    <a
                      href={link.url}
                      target={link.type === "external" ? "_blank" : undefined}
                      rel={link.type === "external" ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.type === "external" ? (
                        <ArrowUpRight className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <LinkIcon className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate max-w-[200px]">{link.url}</span>
                    </a>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyLink(link.url, index);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyLink(link.url, index);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors flex-shrink-0 m-1 touch-manipulation z-20 relative pointer-events-auto"
                      aria-label="Copy link"
                      type="button"
                      style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                    >
                      {copiedLinkIndex === index ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: Links (keep current mobile view) */}
            {blog.links.length > 0 && (
              <motion.div 
                className="flex flex-col gap-2 md:hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {blog.links.map((link, index) => (
                  <motion.div
                    key={index}
                    className="w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.4 + (index * 0.05),
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <div className="inline-flex items-center w-full rounded-full border border-input bg-background hover:bg-accent transition-colors overflow-hidden relative">
                      <a
                        href={link.url}
                        target={link.type === "external" ? "_blank" : undefined}
                        rel={link.type === "external" ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium flex-1 min-w-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.type === "external" ? (
                          <ArrowUpRight className="h-3 w-3 flex-shrink-0" />
                        ) : (
                          <LinkIcon className="h-3 w-3 flex-shrink-0" />
                        )}
                        <span className="truncate">{link.url}</span>
                      </a>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopyLink(link.url, index);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopyLink(link.url, index);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors flex-shrink-0 m-1 touch-manipulation z-20 relative pointer-events-auto"
                        aria-label="Copy link"
                        type="button"
                        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                      >
                        {copiedLinkIndex === index ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </header>

        {/* Blog Content */}
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-code:font-mono prose-pre:bg-muted prose-pre:border prose-pre:border-border">
          <div className="max-w-4xl mx-auto">
            <BlogRenderer blog={blog} />
          </div>
        </div>

        {/* Comments Section */}
        {blogId && (
          <Comments blogSlug={blogId} enabled={blog.settings.enableComments} />
        )}

        </div>
      </div>
    </SidebarInset>
  );
}


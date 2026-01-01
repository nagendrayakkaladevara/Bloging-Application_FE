/**
 * BlogPage Component
 * 
 * Renders a single blog with all its features:
 * - Blog content (blocks)
 * - Voting (if enabled)
 * - Social Share (if enabled)
 * - Tags and metadata
 */

import { useParams, Link } from "react-router-dom";
import type { Blog } from "@/types/blog";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { Voting } from "@/components/blog/Voting";
import { SocialShare } from "@/components/blog/SocialShare";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

interface BlogPageProps {
  blog: Blog | null;
  onVote?: (blogId: string, vote: "upvote" | "downvote") => void;
}

export function BlogPage({ blog, onVote }: BlogPageProps) {
  const { blogId } = useParams<{ blogId: string }>();

  const handleVote = (vote: "upvote" | "downvote") => {
    if (onVote && blogId) {
      onVote(blogId, vote);
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation */}
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.meta.title}</h1>
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

        {/* Social Share */}
        {blog.settings.enableSocialShare && (
          <SocialShare
            socialShare={blog.socialShare}
            url={window.location.href}
            title={blog.meta.title}
          />
        )}
      </div>
    </div>
  );
}


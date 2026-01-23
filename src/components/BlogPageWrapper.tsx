import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { BlogPage } from "@/pages/BlogPage";
import { useBlog } from "@/hooks/useBlog";
import { AppSidebar } from "@/components/AppSidebar";
import { BlogSkeleton } from "@/components/BlogSkeleton";
import type { BlogPreview } from "@/types/blog";

interface BlogPageWrapperProps {
  blogs: BlogPreview[];
  onVote?: (blogId: string, vote: "upvote" | "downvote") => void;
}

export function BlogPageWrapper({ blogs, onVote }: BlogPageWrapperProps) {
  const { blogId } = useParams<{ blogId: string }>();
  const { blog, loading, error } = useBlog(blogId);

  // Scroll to top when blogId changes
  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      // Also try scrolling the document element
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    return () => clearTimeout(timer);
  }, [blogId]);

  if (loading) {
    return (
      <>
        <AppSidebar blogs={blogs} />
        <BlogSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppSidebar blogs={blogs} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Error Loading Blog</h1>
            <p className="text-muted-foreground mb-4">{error.message}</p>
          </div>
        </div>
      </>
    );
  }

  // Handle case where blog is null (not found) but no error was thrown
  if (!blog) {
    return (
      <>
        <AppSidebar blogs={blogs} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Blog Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The blog you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppSidebar blogs={blogs} />
      <BlogPage blog={blog} onVote={onVote} />
    </>
  );
}


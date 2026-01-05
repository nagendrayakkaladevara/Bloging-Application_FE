import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { BlogPage } from "@/pages/BlogPage";
import { getBlogById } from "@/data/mockBlogs";
import { AppSidebar } from "@/components/AppSidebar";
import type { BlogPreview } from "@/types/blog";

interface BlogPageWrapperProps {
  onVote?: (blogId: string, vote: "upvote" | "downvote") => void;
  blogs: BlogPreview[];
}

export function BlogPageWrapper({ onVote, blogs }: BlogPageWrapperProps) {
  const { blogId } = useParams<{ blogId: string }>();
  const blog = blogId ? getBlogById(blogId) ?? null : null;

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

  return (
    <>
      <AppSidebar blogs={blogs} />
      <BlogPage blog={blog} onVote={onVote} />
    </>
  );
}


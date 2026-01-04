import { useParams } from "react-router-dom";
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

  return (
    <>
      <AppSidebar blogs={blogs} />
      <BlogPage blog={blog} onVote={onVote} />
    </>
  );
}


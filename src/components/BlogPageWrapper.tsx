import { useParams } from "react-router-dom";
import { BlogPage } from "@/pages/BlogPage";
import { getBlogById } from "@/data/mockBlogs";

interface BlogPageWrapperProps {
  onVote?: (blogId: string, vote: "upvote" | "downvote") => void;
}

export function BlogPageWrapper({ onVote }: BlogPageWrapperProps) {
  const { blogId } = useParams<{ blogId: string }>();
  const blog = blogId ? getBlogById(blogId) ?? null : null;

  return <BlogPage blog={blog} onVote={onVote} />;
}


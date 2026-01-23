/**
 * useComments Hook
 * 
 * React hook for fetching and managing comments.
 */

import { useState, useEffect, useCallback } from "react";
import type { Comment } from "@/components/blog/Comments";
import { getComments, createComment as createCommentApi } from "@/lib/api";

export function useComments(blogSlug: string | undefined, enabled: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    if (!blogSlug || !enabled) {
      setComments([]);
      return;
    }

    let cancelled = false;

    async function fetchComments() {
      try {
        setLoading(true);
        setError(null);
        if (!blogSlug) return;
        const data = await getComments(blogSlug);
        
        if (!cancelled) {
          setComments(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch comments"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchComments();

    return () => {
      cancelled = true;
    };
  }, [blogSlug, enabled]);

  // Create comment
  const createComment = useCallback(
    async (name: string, comment: string) => {
      if (!blogSlug) return;

      try {
        setSubmitting(true);
        setError(null);
        const newComment = await createCommentApi(blogSlug, name, comment);
        setComments((prev) => [newComment, ...prev]);
        return newComment;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create comment");
        setError(error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [blogSlug]
  );

  return { comments, loading, error, submitting, createComment };
}

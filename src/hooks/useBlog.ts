/**
 * useBlog Hook
 * 
 * React hook for fetching a single blog by slug/ID.
 */

import { useState, useEffect } from "react";
import type { Blog } from "@/types/blog";
import { getBlogById } from "@/lib/api";

export function useBlog(blogId: string | undefined) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!blogId) {
      setBlog(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchBlog() {
      try {
        setLoading(true);
        setError(null);
        if (!blogId) return;
        const data = await getBlogById(blogId);
        
        if (!cancelled) {
          setBlog(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch blog"));
          setBlog(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBlog();

    return () => {
      cancelled = true;
    };
  }, [blogId]);

  return { blog, loading, error };
}

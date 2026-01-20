/**
 * useBlogs Hook
 * 
 * React hook for fetching and managing blogs.
 */

import { useState, useEffect } from "react";
import type { BlogPreview } from "@/types/blog";
import { getBlogPreviews } from "@/lib/api";

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPreviews();
        
        if (!cancelled) {
          setBlogs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch blogs"));
          setBlogs([]); // Fallback to empty array on error
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  return { blogs, loading, error };
}

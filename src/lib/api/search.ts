/**
 * Search API
 * 
 * API functions for search operations.
 */

import { apiClient } from "../api-client";
import type { BlogPreview } from "@/types/blog";
import { transformBlogPreview } from "./transformers";
import type { ApiSearchResult } from "./types";

/**
 * Search blogs by query
 */
export async function searchBlogs(query: string): Promise<BlogPreview[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await apiClient.get<ApiSearchResult>("/search", {
      q: query,
    });
    return response.blogs.map(transformBlogPreview);
  } catch (error) {
    console.error("Failed to search blogs:", error);
    return [];
  }
}

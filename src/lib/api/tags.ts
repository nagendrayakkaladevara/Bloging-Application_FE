/**
 * Tags API
 * 
 * API functions for tag operations.
 */

import { apiClient } from "../api-client";
import type { BlogPreview } from "@/types/blog";
import { transformBlogPreview } from "./transformers";
import type {
  ApiTag,
  ApiTagsResponse,
  ApiTagBlogsResponse,
} from "./types";

export interface Tag {
  slug: string;
  name: string;
  count: number;
}

/**
 * Get all tags
 */
export async function getTags(): Promise<Tag[]> {
  try {
    const response = await apiClient.get<ApiTagsResponse>("/tags");
    return response.tags.map((tag) => ({
      slug: tag.slug,
      name: tag.name,
      count: tag.count,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

/**
 * Get blogs by tag slug
 */
export async function getBlogsByTag(slug: string): Promise<BlogPreview[]> {
  try {
    const response = await apiClient.get<ApiTagBlogsResponse>(`/tags/${slug}`);
    return response.blogs.map(transformBlogPreview);
  } catch (error) {
    console.error(`Failed to fetch blogs for tag ${slug}:`, error);
    return [];
  }
}

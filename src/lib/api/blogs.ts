/**
 * Blogs API
 * 
 * API functions for blog-related operations.
 */

import { apiClient } from "../api-client";
import type { Blog, BlogPreview } from "@/types/blog";
import { transformBlog, transformBlogPreview } from "./transformers";
import type {
  ApiBlog,
  ApiBlogPreview,
  ApiPaginatedBlogs,
} from "./types";
import type { PaginatedResponse } from "../api-client";
import { getCachedBlog, setCachedBlog } from "../cache/blogCache";

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "popular";
  tags?: string[];
  author?: string;
  search?: string;
}

/**
 * Get all blogs with pagination and filtering
 */
export async function getBlogs(
  params?: GetBlogsParams
): Promise<PaginatedResponse<BlogPreview>> {
  const queryParams: Record<string, string | number> = {};
  
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.sort) queryParams.sort = params.sort;
  if (params?.tags && params.tags.length > 0) {
    queryParams.tags = params.tags.join(",");
  }
  if (params?.author) queryParams.author = params.author;
  if (params?.search) queryParams.search = params.search;

  const response = await apiClient.get<ApiPaginatedBlogs>("/blogs", queryParams);
  
  return {
    data: response.blogs.map(transformBlogPreview),
    pagination: response.pagination,
  };
}

/**
 * Get all blog previews (simplified version for home page)
 */
export async function getBlogPreviews(): Promise<BlogPreview[]> {
  try {
    const response = await getBlogs({ limit: 100 }); // Get first 100 blogs
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog previews:", error);
    return [];
  }
}

/**
 * Get a single blog by slug
 * 
 * Note: The API returns the blog nested in { success: true, data: { blog: {...} } }
 * The apiClient extracts data.data, so we get { blog: {...} }
 * This function handles both nested { blog: ApiBlog } and direct ApiBlog structures
 * 
 * Implements caching to reduce API calls for recently viewed blogs.
 */
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  // Check cache first
  const cachedBlog = getCachedBlog(slug);
  
  if (cachedBlog) {
    // Return cached blog immediately
    return cachedBlog;
  }

  try {
    // API returns { blog: ApiBlog } structure (or ApiBlog directly)
    const response = await apiClient.get<{ blog: ApiBlog } | ApiBlog>(`/blogs/${slug}`);
    
    // Check if response is valid
    if (!response) {
      console.error(`API returned null/undefined for blog with slug ${slug}`);
      return null;
    }

    // Extract the blog from the nested structure or use response directly
    // Check if response has a 'blog' property (nested structure)
    const blog = (response as { blog?: ApiBlog }).blog || (response as ApiBlog);
    
    // Validate required fields
    if (!blog || !blog.meta || !Array.isArray(blog.blocks)) {
      console.error(`Invalid blog response structure for slug ${slug}:`, {
        response,
        hasMeta: !!blog?.meta,
        hasBlocks: Array.isArray(blog?.blocks),
      });
      return null;
    }

    const transformedBlog = transformBlog(blog);
    
    // Store in cache for future requests
    if (transformedBlog) {
      setCachedBlog(slug, transformedBlog);
    }

    return transformedBlog;
  } catch (error) {
    // Log detailed error information
    if (error instanceof Error) {
      console.error(`Failed to fetch blog with slug ${slug}:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error(`Failed to fetch blog with slug ${slug}:`, error);
    }
    return null;
  }
}

/**
 * Get blog by ID (for backward compatibility)
 * Note: The API uses slugs, but we'll try to use the ID as a slug
 */
export async function getBlogById(id: string): Promise<Blog | null> {
  return getBlogBySlug(id);
}

/**
 * Comments API
 * 
 * API functions for comment operations.
 */

import { apiClient } from "../api-client";
import type { Comment } from "@/components/blog/Comments";
import { transformComment } from "./transformers";
import type { ApiComment, ApiCommentsResponse, ApiCreateCommentRequest } from "./types";
import { getCachedComments, setCachedComments, removeCachedComments } from "../cache/commentsCache";

/**
 * Get comments for a blog
 * 
 * Implements caching to reduce API calls for recently fetched comments.
 */
export async function getComments(slug: string): Promise<Comment[]> {
  // Check cache first
  const cachedComments = getCachedComments(slug);
  
  if (cachedComments) {
    // Return cached comments immediately
    return cachedComments;
  }

  try {
    const response = await apiClient.get<ApiCommentsResponse>(`/blogs/${slug}/comments`);
    const comments = response.comments.map(transformComment);
    
    // Store in cache for future requests
    setCachedComments(slug, comments);
    
    return comments;
  } catch (error) {
    console.error(`Failed to fetch comments for blog ${slug}:`, error);
    return [];
  }
}

/**
 * Create a new comment
 * 
 * Note: The API returns the comment nested in { success: true, data: { comment: {...} } }
 * The apiClient extracts data.data, so we get { comment: {...} }
 * This function handles both nested { comment: ApiComment } and direct ApiComment structures
 * 
 * Invalidates the comments cache for the blog to ensure fresh data on next fetch.
 */
export async function createComment(
  slug: string,
  name: string,
  comment: string
): Promise<Comment> {
  const request: ApiCreateCommentRequest = { name, comment };
  // API returns { comment: ApiComment } structure (or ApiComment directly)
  const response = await apiClient.post<{ comment: ApiComment } | ApiComment>(`/blogs/${slug}/comments`, request);
  
  // Extract the comment from the nested structure or use response directly
  const commentData = (response as { comment?: ApiComment }).comment || (response as ApiComment);
  
  const newComment = transformComment(commentData);
  
  // Invalidate cache so next fetch gets the updated comments list
  removeCachedComments(slug);
  
  return newComment;
}

/**
 * Comments Cache Utility
 * 
 * Provides in-memory caching for blog comments with expiration.
 * Reduces API calls by storing recently fetched comments.
 */

import type { Comment } from "@/components/blog/Comments";

interface CachedComments {
  data: Comment[];
  timestamp: number;
}

// Cache expiration time: 15 minutes (900,000 milliseconds)
const CACHE_EXPIRATION_MS = 15 * 60 * 1000;

// In-memory cache store (keyed by blog slug)
const cache = new Map<string, CachedComments>();

/**
 * Get comments from cache if they exist and haven't expired
 */
export function getCachedComments(blogSlug: string): Comment[] | null {
  const cached = cache.get(blogSlug);
  
  if (!cached) {
    return null;
  }

  // Check if cache has expired
  const now = Date.now();
  const age = now - cached.timestamp;
  
  if (age > CACHE_EXPIRATION_MS) {
    // Cache expired, remove it
    cache.delete(blogSlug);
    return null;
  }

  return cached.data;
}

/**
 * Store comments in cache
 */
export function setCachedComments(blogSlug: string, comments: Comment[]): void {
  cache.set(blogSlug, {
    data: comments,
    timestamp: Date.now(),
  });
}

/**
 * Remove comments for a specific blog from cache
 * Useful when a new comment is added to invalidate stale data
 */
export function removeCachedComments(blogSlug: string): void {
  cache.delete(blogSlug);
}

/**
 * Clear all cached comments
 */
export function clearCommentsCache(): void {
  cache.clear();
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getCommentsCacheStats() {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  
  return {
    totalEntries: entries.length,
    validEntries: entries.filter(([_, cached]) => {
      const age = now - cached.timestamp;
      return age <= CACHE_EXPIRATION_MS;
    }).length,
    expiredEntries: entries.filter(([_, cached]) => {
      const age = now - cached.timestamp;
      return age > CACHE_EXPIRATION_MS;
    }).length,
  };
}

/**
 * Clean up expired entries from cache
 * This can be called periodically to free up memory
 */
export function cleanupExpiredCommentsCache(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];

  cache.forEach((cached, key) => {
    const age = now - cached.timestamp;
    if (age > CACHE_EXPIRATION_MS) {
      expiredKeys.push(key);
    }
  });

  expiredKeys.forEach(key => cache.delete(key));
}

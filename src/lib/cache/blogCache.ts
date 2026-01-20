/**
 * Blog Cache Utility
 * 
 * Provides in-memory caching for blog posts with expiration.
 * Reduces API calls by storing recently viewed blog posts.
 */

import type { Blog } from "@/types/blog";

interface CachedBlog {
  data: Blog;
  timestamp: number;
}

// Cache expiration time: 15 minutes (900,000 milliseconds)
const CACHE_EXPIRATION_MS = 15 * 60 * 1000;

// In-memory cache store
const cache = new Map<string, CachedBlog>();

/**
 * Get a blog from cache if it exists and hasn't expired
 */
export function getCachedBlog(slug: string): Blog | null {
  const cached = cache.get(slug);
  
  if (!cached) {
    return null;
  }

  // Check if cache has expired
  const now = Date.now();
  const age = now - cached.timestamp;
  
  if (age > CACHE_EXPIRATION_MS) {
    // Cache expired, remove it
    cache.delete(slug);
    return null;
  }

  return cached.data;
}

/**
 * Store a blog in cache
 */
export function setCachedBlog(slug: string, blog: Blog): void {
  cache.set(slug, {
    data: blog,
    timestamp: Date.now(),
  });
}

/**
 * Remove a specific blog from cache
 */
export function removeCachedBlog(slug: string): void {
  cache.delete(slug);
}

/**
 * Clear all cached blogs
 */
export function clearBlogCache(): void {
  cache.clear();
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getCacheStats() {
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
export function cleanupExpiredCache(): void {
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

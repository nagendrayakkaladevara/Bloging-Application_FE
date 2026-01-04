/**
 * useFavorites Hook
 * 
 * Manages favorite blogs using localStorage.
 */

import { useState, useEffect } from "react";

const FAVORITES_STORAGE_KEY = "blog_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  const addFavorite = (blogId: string) => {
    setFavorites((prev) => {
      if (!prev.includes(blogId)) {
        return [...prev, blogId];
      }
      return prev;
    });
  };

  const removeFavorite = (blogId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== blogId));
  };

  const toggleFavorite = (blogId: string) => {
    setFavorites((prev) => {
      if (prev.includes(blogId)) {
        return prev.filter((id) => id !== blogId);
      }
      return [...prev, blogId];
    });
  };

  const isFavorite = (blogId: string) => {
    return favorites.includes(blogId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}


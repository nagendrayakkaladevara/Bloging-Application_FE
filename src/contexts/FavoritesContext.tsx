/**
 * FavoritesContext
 * 
 * Provides global state management for favorites using React Context.
 * This ensures all components share the same favorites state and
 * updates are reflected immediately across the entire application.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FAVORITES_STORAGE_KEY = "blog_favorites";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (blogId: string) => void;
  removeFavorite: (blogId: string) => void;
  toggleFavorite: (blogId: string) => void;
  isFavorite: (blogId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
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

  const addFavorite = useCallback((blogId: string) => {
    setFavorites((prev) => {
      if (!prev.includes(blogId)) {
        return [...prev, blogId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((blogId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== blogId));
  }, []);

  const toggleFavorite = useCallback((blogId: string) => {
    setFavorites((prev) => {
      if (prev.includes(blogId)) {
        return prev.filter((id) => id !== blogId);
      }
      return [...prev, blogId];
    });
  }, []);

  const isFavorite = useCallback((blogId: string) => {
    return favorites.includes(blogId);
  }, [favorites]);

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

/**
 * Main App Component
 * 
 * Sets up routing and manages application state.
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { BlogPageWrapper } from "@/components/BlogPageWrapper";
import { CalendarPage } from "@/pages/CalendarPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { HelpPage } from "@/pages/HelpPage";
import { AskAIPage } from "@/pages/AskAIPage";
import { useBlogs } from "@/hooks/useBlogs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BlogSearchDialog } from "@/components/BlogSearchDialog";
import { useSearch } from "@/contexts/SearchContext";
import { cleanupExpiredCache } from "@/lib/cache/blogCache";
import { cleanupExpiredCommentsCache } from "@/lib/cache/commentsCache";
import { Toaster } from "@/components/ui/toaster";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

function GlobalKeyboardShortcuts() {
  const { openSearch } = useSearch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openSearch]);

  return null;
}

function App() {
  const { blogs, loading } = useBlogs();

  // Clean up expired cache entries every 5 minutes
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      cleanupExpiredCache();
      cleanupExpiredCommentsCache();
    }, 5 * 60 * 1000); // 5 minutes

    // Clean up on unmount
    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  const handleVote = () => {
    // Vote handling logic can be implemented here
    // For now, this is a placeholder
  };

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <GlobalKeyboardShortcuts />
        <BlogSearchDialog blogs={blogs} />
        <Toaster />
        <Routes>
        <Route
          path="/"
          element={
            <SidebarProvider defaultOpen={false}>
              <HomePage blogs={blogs} loading={loading} />
            </SidebarProvider>
          }
        />
        <Route
          path="/blog/:blogId"
          element={
            <SidebarProvider defaultOpen={false}>
              <BlogPageWrapper blogs={blogs} onVote={handleVote} />
            </SidebarProvider>
          }
        />
        <Route
          path="/calendar"
          element={
            <SidebarProvider defaultOpen={false}>
              <CalendarPage blogs={blogs} />
            </SidebarProvider>
          }
        />
        <Route
          path="/settings"
          element={
            <SidebarProvider defaultOpen={false}>
              <SettingsPage blogs={blogs} />
            </SidebarProvider>
          }
        />
        <Route
          path="/help"
          element={
            <SidebarProvider defaultOpen={false}>
              <HelpPage blogs={blogs} />
            </SidebarProvider>
          }
        />
        <Route
          path="/ask-ai"
          element={
            <SidebarProvider defaultOpen={false}>
              <AskAIPage blogs={blogs} />
            </SidebarProvider>
          }
        />
      </Routes>
    </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;

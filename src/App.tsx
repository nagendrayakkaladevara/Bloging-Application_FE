/**
 * Main App Component
 * 
 * Sets up routing and manages application state.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { BlogPageWrapper } from "@/components/BlogPageWrapper";
import { CalendarPage } from "@/pages/CalendarPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { HelpPage } from "@/pages/HelpPage";
import { getBlogPreviews } from "@/data/mockBlogs";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BlogSearchDialog } from "@/components/BlogSearchDialog";
import { useSearch } from "@/contexts/SearchContext";

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
  const [blogs] = useState(getBlogPreviews());

  const handleVote = (_blogId: string, _vote: "upvote" | "downvote") => {
    // Vote handling logic can be implemented here
    // For now, this is a placeholder
  };

  return (
    <BrowserRouter>
      <GlobalKeyboardShortcuts />
      <BlogSearchDialog blogs={blogs} />
      <Routes>
        <Route path="/" element={<HomePage blogs={blogs} />} />
        <Route
          path="/blog/:blogId"
          element={
            <SidebarProvider defaultOpen={false}>
              <BlogPageWrapper onVote={handleVote} blogs={blogs} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/**
 * Main App Component
 * 
 * Sets up routing and manages application state.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { BlogPageWrapper } from "@/components/BlogPageWrapper";
import { getBlogPreviews } from "@/data/mockBlogs";
import { useState } from "react";

function App() {
  const [blogs] = useState(getBlogPreviews());

  const handleVote = (_blogId: string, _vote: "upvote" | "downvote") => {
    // Vote handling logic can be implemented here
    // For now, this is a placeholder
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage blogs={blogs} />} />
        <Route
          path="/blog/:blogId"
          element={<BlogPageWrapper onVote={handleVote} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

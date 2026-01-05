/**
 * HomePage Component
 * 
 * Displays a hero section and a simple blog catalogue.
 */

import { Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Hero } from "@/components/Hero";
import { EmptyBlogState } from "@/components/EmptyBlogState";
import type { BlogPreview } from "@/types/blog";
import { Calendar, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";
import { useEffect, useState } from "react";

interface HomePageProps {
  blogs: BlogPreview[];
}

export function HomePage({ blogs }: HomePageProps) {
  const { openSearch } = useSearch();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Search Shortcut Button - Top Right Corner */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex flex-col items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={openSearch}
          className="h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 bg-background/80 backdrop-blur-sm border-border"
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
        </Button>
        <kbd className="px-1.5 py-0.5 text-[10px] rounded border bg-background/80 backdrop-blur-sm text-muted-foreground font-mono">
          {isMac ? "⌘" : "Ctrl"}K
        </kbd>
      </motion.div>
        {/* Hero Section */}
        <Hero />
        
        {/* Blog Catalogue Section */}
        <div id="blogs" className="min-h-screen w-full bg-background relative">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 z-0 bg-blog-grid" />
          {/* Blog Content */}
          <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
            {blogs.length === 0 ? (
              <EmptyBlogState />
            ) : (
              <div className="space-y-4">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <Link to={`/blog/${blog.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="bg-card hover:shadow-lg transition-shadow cursor-pointer overflow-hidden mb-3">
                          <div className="flex flex-row">
                            {/* Left side - Content */}
                            <div className="flex-1 p-4 sm:p-6">
                              <CardTitle className="mb-3 sm:mb-4 text-base sm:text-xl">
                                {blog.meta.title}
                              </CardTitle>
                              <div className="flex flex-row gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>{formatDate(blog.meta.publishedAt)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>{blog.meta.readTime} min read</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right side - Image (if available) - Hidden on mobile */}
                            {blog.meta.coverImage && (
                              <div className="hidden sm:block w-48 h-auto shrink-0">
                                <img
                                  src={blog.meta.coverImage}
                                  alt={blog.meta.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}


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
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface HomePageProps {
  blogs: BlogPreview[];
}

export function HomePage({ blogs }: HomePageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <Hero />
        
        {/* Blog Catalogue Section */}
        <div id="blogs" className="min-h-screen w-full bg-white relative">
          {/* Magenta Orb Grid Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "white",
              backgroundImage: `
                linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
                radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
              `,
              backgroundSize: "40px 40px, 40px 40px, 100% 100%",
            }}
          />
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
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <Link to={`/blog/${blog.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer overflow-hidden mb-3">
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


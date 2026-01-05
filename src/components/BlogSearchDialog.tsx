"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Calendar, Clock, ArrowRight } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import type { BlogPreview } from "@/types/blog";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface BlogSearchDialogProps {
  blogs: BlogPreview[];
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15 },
    },
  },
} as const;

export function BlogSearchDialog({ blogs }: BlogSearchDialogProps) {
  const { isOpen, closeSearch } = useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 200);

  const filteredBlogs = useMemo(() => {
    if (!debouncedQuery.trim()) return blogs.slice(0, 10); // Show first 10 when no query

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    return blogs.filter((blog) => {
      const searchableText = `${blog.meta.title} ${blog.meta.description || ""} ${blog.tags.join(" ")}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [debouncedQuery, blogs]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredBlogs]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setActiveIndex(-1);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!filteredBlogs.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredBlogs.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredBlogs.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filteredBlogs[activeIndex]) {
            const blog = filteredBlogs[activeIndex];
            closeSearch();
            navigate(`/blog/${blog.id}`);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeSearch();
          break;
      }
    },
    [filteredBlogs, activeIndex, closeSearch, navigate]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={closeSearch}>
      <SheetContent side="top" className="max-w-4xl mx-auto p-0 gap-0 overflow-hidden max-h-[85vh] flex flex-col data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">Search Blogs</SheetTitle>
        </SheetHeader>
        
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search blog posts by title, description, or tags..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-4 h-11 text-base"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {filteredBlogs.length > 0 ? (
              <motion.div
                variants={ANIMATION_VARIANTS.container}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-4"
              >
                <motion.ul className="space-y-1" role="listbox">
                  {filteredBlogs.map((blog, index) => (
                    <motion.li
                      key={blog.id}
                      variants={ANIMATION_VARIANTS.item}
                      layout
                    >
                      <Link
                        to={`/blog/${blog.id}`}
                        onClick={closeSearch}
                        className={cn(
                          "block px-4 py-3 rounded-lg border transition-colors",
                          "hover:bg-accent hover:border-accent-foreground/20",
                          "focus:bg-accent focus:outline-none",
                          activeIndex === index && "bg-accent border-accent-foreground/20"
                        )}
                        role="option"
                        aria-selected={activeIndex === index}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                              <h3 className="font-semibold text-sm sm:text-base truncate">
                                {blog.meta.title}
                              </h3>
                            </div>
                            {blog.meta.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                                {blog.meta.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(blog.meta.publishedAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{blog.meta.readTime} min read</span>
                              </div>
                            </div>
                            {blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {blog.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : query.trim() ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center py-12"
              >
                <p className="text-sm text-muted-foreground">
                  No blogs found matching "{query}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center py-12"
              >
                <p className="text-sm text-muted-foreground">
                  Start typing to search for blog posts...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">Enter</kbd>
                <span>Select</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">
                  {isMac ? "⌘" : "Ctrl"}
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">K</kbd>
                <span>Open</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">Esc</kbd>
                <span>Close</span>
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}


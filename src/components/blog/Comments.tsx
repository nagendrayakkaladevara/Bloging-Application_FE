/**
 * Comments Component
 * 
 * Handles comments functionality for blogs.
 * Medium-inspired clean and professional design.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useComments } from "@/hooks/useComments";

export interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
}

interface CommentsProps {
  blogSlug: string;
  enabled: boolean;
}

export function Comments({ blogSlug, enabled }: CommentsProps) {
  const { comments, loading, submitting, createComment } = useComments(blogSlug, enabled);
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [isFormFocused, setIsFormFocused] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      return;
    }

    try {
      await createComment(name.trim(), comment.trim());
      setName("");
      setComment("");
      setIsFormFocused(false);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return "A";
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .filter((char) => char)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";
  };

  const getAvatarColor = (name: string | undefined | null) => {
    // Medium-style subtle colors
    const colors = [
      "bg-[#3B49DF]",
      "bg-[#0F7B0F]",
      "bg-[#B9351E]",
      "bg-[#E16745]",
      "bg-[#6B46C1]",
      "bg-[#059669]",
      "bg-[#DC2626]",
      "bg-[#7C2D12]",
    ];
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return colors[0];
    }
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="mt-16 pt-12 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        {/* Header - Medium style */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {comments.length > 0 ? `${comments.length} ${comments.length === 1 ? 'Response' : 'Responses'}` : 'Responses'}
          </h2>
        </div>

        {/* Comment Form - Medium style inline */}
        <div className="mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className={cn("h-10 w-10 shrink-0", getAvatarColor(name || "Anonymous"))}>
                <AvatarFallback className={cn("text-white text-sm font-medium", getAvatarColor(name || "Anonymous"))}>
                  {getInitials(name || "A")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="What's your name?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsFormFocused(true)}
                  required
                  className="h-9 border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors bg-transparent placeholder:text-muted-foreground/60"
                />
                <Textarea
                  placeholder="What are your thoughts?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={() => setIsFormFocused(true)}
                  required
                  rows={isFormFocused ? 4 : 1}
                  className="resize-none border-0 border-b border-border/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-all bg-transparent placeholder:text-muted-foreground/60 min-h-[24px]"
                />
                
                {isFormFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-end gap-3 pt-2"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsFormFocused(false);
                        setName("");
                        setComment("");
                      }}
                      className="h-8 px-4 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !name.trim() || !comment.trim()}
                      className="h-8 px-6 text-sm font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Publishing..." : "Publish"}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Comments List - Medium style */}
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {comments.length === 0 ? (
              <motion.div
                key="no-comments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-[15px]">
                  No responses yet. Be the first to respond.
                </p>
              </motion.div>
            ) : (
              comments.map((commentItem, index) => (
                <motion.article
                  key={commentItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                  }}
                  className="py-8 border-b border-border/30 last:border-b-0"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar className={cn("h-10 w-10 shrink-0", getAvatarColor(commentItem.name))}>
                      <AvatarFallback className={cn("text-white text-sm font-medium", getAvatarColor(commentItem.name))}>
                        {getInitials(commentItem.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground text-[15px]">
                          {commentItem.name || "Anonymous"}
                        </span>
                        <span className="text-muted-foreground text-[13px]">
                          {formatDate(commentItem.createdAt)}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-[15px] font-normal">
                          {commentItem.comment || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

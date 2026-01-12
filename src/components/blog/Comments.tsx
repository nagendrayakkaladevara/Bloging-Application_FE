/**
 * Comments Component
 * 
 * Handles comments functionality for blogs.
 * Allows users to add comments with name and comment text.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
}

interface CommentsProps {
  blogId: string;
  enabled: boolean;
}

export function Comments({ blogId, enabled }: CommentsProps) {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load comments from localStorage on mount
  React.useEffect(() => {
    const storedComments = localStorage.getItem(`blog-comments-${blogId}`);
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    }
  }, [blogId]);

  // Save comments to localStorage whenever they change
  React.useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`blog-comments-${blogId}`, JSON.stringify(comments));
    }
  }, [comments, blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setName("");
    setComment("");
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-cyan-500 to-cyan-600",
      "bg-gradient-to-br from-rose-500 to-rose-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      className="mt-20 pt-16 pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Premium Header */}
        <motion.div
          className="flex items-center justify-between mb-12 pb-10 border-b border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-xl border border-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Comments
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Join the conversation
              </p>
            </div>
          </div>
          {comments.length > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-1.5 text-sm font-semibold border-border/50 bg-muted/50"
            >
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </Badge>
          )}
        </motion.div>

        {/* Premium Comment Form */}
        <motion.div
          className="mb-16 p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="comment-name" 
                className="text-sm font-semibold text-foreground/90"
              >
                Your Name
              </Label>
              <Input
                id="comment-name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="comment-text" 
                className="text-sm font-semibold text-foreground/90"
              >
                Your Comment
              </Label>
              <Textarea
                id="comment-text"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={5}
                className="resize-none border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center gap-3"
            >
              <Button
                type="submit"
                disabled={isSubmitting || !name.trim() || !comment.trim()}
                className="rounded-full gap-2 px-8 h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="default"
              >
                <motion.div
                  animate={{ 
                    rotate: isSubmitting ? [0, 10, -10, 0] : 0,
                    scale: isSubmitting ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: isSubmitting ? Infinity : 0,
                    repeatDelay: 0.2
                  }}
                >
                  <Send className="h-4 w-4" />
                </motion.div>
                <span>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </span>
              </Button>
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Publishing your comment...</span>
                </motion.div>
              )}
            </motion.div>
          </form>
        </motion.div>

        {/* Premium Comments List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {comments.length === 0 ? (
              <motion.div
                key="no-comments"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 mb-6"
                >
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-foreground/90">
                  No comments yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Be the first to share your thoughts and start the conversation!
                </p>
              </motion.div>
            ) : (
              comments.map((commentItem, index) => (
                <motion.div
                  key={commentItem.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.03,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="group relative"
                >
                  <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-card/30 hover:border-border hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      {/* Premium Avatar */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 15,
                          delay: index * 0.03 + 0.1
                        }}
                      >
                        <Avatar className={cn("h-12 w-12 border-2 border-border/50 shadow-lg", getAvatarColor(commentItem.name))}>
                          <AvatarFallback className={cn("text-white font-bold text-sm", getAvatarColor(commentItem.name))}>
                            {getInitials(commentItem.name)}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground text-base mb-1.5 group-hover:text-primary transition-colors">
                              {commentItem.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium border-border/50 bg-muted/30"
                            >
                              {formatDate(commentItem.createdAt)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-[15px]">
                          {commentItem.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

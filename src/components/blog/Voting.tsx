/**
 * Voting Component
 * 
 * Handles upvote/downvote functionality for blogs.
 */

import type { BlogVoting } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useVoting } from "@/hooks/useVoting";
import { useEffect, useRef, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { VoteResult } from "@/lib/api/voting";

interface VotingProps {
  voting: BlogVoting;
  blogSlug: string;
  onVoteChange?: (voting: BlogVoting) => void;
}

export function Voting({ voting, blogSlug, onVoteChange }: VotingProps) {
  const { toast } = useToast();
  const { voting: apiVoting, loading, vote, error } = useVoting(blogSlug, voting);
  
  // Track last vote action to prevent duplicate toasts
  const lastVoteRef = useRef<{ type: "upvote" | "downvote" | null; timestamp: number }>({
    type: null,
    timestamp: 0,
  });
  
  // Debounce rapid clicks (300ms)
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync API voting state with prop voting state
  // Use ref to track previous values and prevent infinite loops
  const previousApiVotingRef = useRef<VoteResult | null>(null);
  const isErrorStateRef = useRef(false);
  const isVotingActiveRef = useRef(false); // Prevent onVoteChange during active voting
  
  useEffect(() => {
    // Don't sync during error state to prevent blinking
    if (error) {
      isErrorStateRef.current = true;
      // Clear error state flag after a delay
      const timer = setTimeout(() => {
        isErrorStateRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
    
    // Don't call onVoteChange during active voting operations (optimistic updates)
    if (isVotingActiveRef.current || loading || isProcessing) {
      return;
    }
    
    if (apiVoting && onVoteChange && !isErrorStateRef.current) {
      // Only call onVoteChange if values actually changed
      const prev = previousApiVotingRef.current;
      if (
        !prev ||
        prev.upvotes !== apiVoting.upvotes ||
        prev.downvotes !== apiVoting.downvotes ||
        prev.userVote !== apiVoting.userVote
      ) {
        previousApiVotingRef.current = apiVoting;
        onVoteChange({
          ...voting,
          upvotes: apiVoting.upvotes,
          downvotes: apiVoting.downvotes,
          userVote: apiVoting.userVote,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiVoting, error, loading, isProcessing]);

  // Use API voting if available, otherwise fall back to prop voting
  // Handle null/undefined states gracefully
  // Memoize to prevent unnecessary re-renders
  // Use stable comparison based on actual values, not object references
  const currentVoting: BlogVoting = useMemo(() => {
    const upvotes = apiVoting?.upvotes ?? voting.upvotes ?? 0;
    const downvotes = apiVoting?.downvotes ?? voting.downvotes ?? 0;
    const userVote = apiVoting?.userVote ?? voting.userVote ?? null;
    
    return {
      ...voting,
      upvotes,
      downvotes,
      userVote,
      enabled: voting.enabled ?? false,
    };
  }, [
    apiVoting?.upvotes,
    apiVoting?.downvotes,
    apiVoting?.userVote,
    voting.upvotes,
    voting.downvotes,
    voting.userVote,
    voting.enabled,
  ]);

  // Don't render if voting is disabled or voting state is invalid
  if (!currentVoting.enabled || !currentVoting) {
    return null;
  }

  const handleVote = async (voteType: "upvote" | "downvote") => {
    // Prevent rapid clicking
    if (isProcessing || loading) {
      return;
    }
    
    // Validate voting state exists
    if (!currentVoting || !blogSlug) {
      console.warn("Cannot vote: missing voting state or blog slug");
      return;
    }
    
    // Debounce: prevent clicks within 300ms
    const now = Date.now();
    if (now - lastVoteRef.current.timestamp < 300 && lastVoteRef.current.type === voteType) {
      return;
    }
    
    setIsProcessing(true);
    isVotingActiveRef.current = true; // Mark voting as active to prevent onVoteChange
    lastVoteRef.current = { type: voteType, timestamp: now };
    
    // Check if user is removing their vote (clicking the same vote again)
    const isRemovingVote = currentVoting.userVote === voteType;
    
    // Show toast immediately (optimistic feedback - no need to wait for API)
    if (isRemovingVote) {
      toast({
        id: `vote-removed-${Date.now()}`,
        title: "Vote removed",
        duration: 3000,
      });
    } else if (voteType === "upvote") {
      toast({
        id: `vote-upvote-${Date.now()}`,
        title: "Thank you for the like!",
        duration: 3000,
      });
    } else {
      toast({
        id: `vote-downvote-${Date.now()}`,
        title: "Thank you for the feedback!",
        duration: 3000,
      });
    }
    
    try {
      // Clear any previous error state before making new request
      isErrorStateRef.current = false;
      
      await vote(voteType);
    } catch (error) {
      console.error("Failed to vote:", error);
      
      // Only show error toast if it's a real error (not a cancelled request)
      const errorMessage = error instanceof Error ? error.message : "Failed to record your vote";
      
      // Don't show error for network issues that might be temporary
      if (errorMessage.includes("timeout") || errorMessage.includes("network")) {
        toast({
          id: `vote-error-network-${Date.now()}`,
          title: "Connection issue",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
          duration: 4000,
        });
      } else if (!errorMessage.includes("cancelled") && !errorMessage.includes("aborted")) {
        toast({
          id: `vote-error-${Date.now()}`,
          title: "Error",
          description: errorMessage || "Failed to record your vote. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } finally {
      // Reset processing state after a short delay to allow for debouncing
      setTimeout(() => {
        setIsProcessing(false);
        isVotingActiveRef.current = false; // Clear voting active flag
      }, 300);
    }
  };

  // Memoize vote states to prevent unnecessary re-renders
  const isUpvoted = useMemo(() => currentVoting.userVote === "upvote", [currentVoting.userVote]);
  const isDownvoted = useMemo(() => currentVoting.userVote === "downvote", [currentVoting.userVote]);
  const isDisabled = useMemo(() => loading || isProcessing || !currentVoting.enabled, [loading, isProcessing, currentVoting.enabled]);

  // Show error state if there's an error
  useEffect(() => {
    if (error && !loading) {
      // Error is already handled in handleVote, but we can add additional handling here if needed
      console.error("Voting error:", error);
    }
  }, [error, loading]);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          variant={isUpvoted ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("upvote")}
          disabled={isDisabled}
          aria-label={isUpvoted ? "Remove like" : "Like this blog"}
          className={cn(
            "rounded-full gap-2 px-4",
            isUpvoted && "bg-primary text-primary-foreground",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <motion.div
              key={`upvote-${isUpvoted ? "active" : "inactive"}`}
              initial={false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <ThumbsUp className="h-4 w-4" />
            </motion.div>
          )}
          <span className="font-medium">{currentVoting.upvotes}</span>
        </Button>
      </motion.div>

      <motion.div
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          variant={isDownvoted ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleVote("downvote")}
          disabled={isDisabled}
          aria-label={isDownvoted ? "Remove dislike" : "Dislike this blog"}
          className={cn(
            "rounded-full gap-2 px-4",
            isDownvoted && "bg-destructive text-destructive-foreground",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <motion.div
              key={`downvote-${isDownvoted ? "active" : "inactive"}`}
              initial={false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <ThumbsDown className="h-4 w-4" />
            </motion.div>
          )}
          <span className="font-medium">{currentVoting.downvotes}</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}


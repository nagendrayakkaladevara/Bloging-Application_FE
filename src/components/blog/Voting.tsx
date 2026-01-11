/**
 * Voting Component
 * 
 * Handles upvote/downvote functionality for blogs.
 */

import type { BlogVoting } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VotingProps {
  voting: BlogVoting;
  onVote?: (vote: "upvote" | "downvote") => void;
}

export function Voting({ voting, onVote }: VotingProps) {
  if (!voting.enabled) {
    return null;
  }

  const handleVote = (vote: "upvote" | "downvote") => {
    if (onVote) {
      onVote(vote);
    }
  };

  const isUpvoted = voting.userVote === "upvote";
  const isDownvoted = voting.userVote === "downvote";

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          variant={isUpvoted ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("upvote")}
          className={cn(
            "rounded-full gap-2 px-4",
            isUpvoted && "bg-primary text-primary-foreground"
          )}
        >
          <motion.div
            key={isUpvoted ? "upvoted" : "not-upvoted"}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <ThumbsUp className="h-4 w-4" />
          </motion.div>
          <span className="font-medium">{voting.upvotes}</span>
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          variant={isDownvoted ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleVote("downvote")}
          className={cn(
            "rounded-full gap-2 px-4",
            isDownvoted && "bg-destructive text-destructive-foreground"
          )}
        >
          <motion.div
            key={isDownvoted ? "downvoted" : "not-downvoted"}
            initial={{ scale: 0.8, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <ThumbsDown className="h-4 w-4" />
          </motion.div>
          <span className="font-medium">{voting.downvotes}</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}


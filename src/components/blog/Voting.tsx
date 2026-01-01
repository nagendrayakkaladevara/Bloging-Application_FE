/**
 * Voting Component
 * 
 * Handles upvote/downvote functionality for blogs.
 */

import type { BlogVoting } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <Card className="my-6">
      <CardContent className="flex items-center gap-4 pt-6">
        <Button
        variant={voting.userVote === "upvote" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("upvote")}
        className={cn(
          "gap-2",
          voting.userVote === "upvote" && "bg-primary"
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{voting.upvotes}</span>
      </Button>

      <Button
        variant={voting.userVote === "downvote" ? "destructive" : "outline"}
        size="sm"
        onClick={() => handleVote("downvote")}
        className={cn(
          "gap-2",
          voting.userVote === "downvote" && "bg-destructive"
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{voting.downvotes}</span>
      </Button>
      </CardContent>
    </Card>
  );
}


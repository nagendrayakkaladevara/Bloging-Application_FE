/**
 * useVoting Hook
 * 
 * React hook for managing blog voting with proper edge case handling.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { voteOnBlog, removeVote } from "@/lib/api";
import type { VoteResult } from "@/lib/api/voting";
import type { BlogVoting } from "@/types/blog";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000; // 10 seconds

export function useVoting(blogSlug: string | undefined, initialVoting?: BlogVoting) {
  // Initialize with initial voting state if provided
  const [voting, setVoting] = useState<VoteResult | null>(() => {
    if (initialVoting) {
      return {
        upvotes: initialVoting.upvotes,
        downvotes: initialVoting.downvotes,
        userVote: initialVoting.userVote,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Track in-flight requests to prevent concurrent calls
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  
  // Flag to prevent state sync during error recovery
  const isRecoveringFromErrorRef = useRef(false);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any in-flight requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Track if we're in the middle of a voting operation to prevent sync loops
  const isVotingOperationRef = useRef(false);
  const lastInitialVotingRef = useRef<{ upvotes: number; downvotes: number; userVote: "upvote" | "downvote" | null } | null>(null);
  
  // Update voting state when initialVoting changes (only if not currently loading)
  // This handles cases where the blog data is refreshed or updated
  useEffect(() => {
    // Don't sync during error recovery or active voting operations to prevent blinking
    if (isRecoveringFromErrorRef.current || isVotingOperationRef.current || loading) {
      return;
    }
    
    if (initialVoting) {
      const newVoting = {
        upvotes: initialVoting.upvotes ?? 0,
        downvotes: initialVoting.downvotes ?? 0,
        userVote: initialVoting.userVote ?? null,
      };
      
      // Compare with last known initial voting values to prevent unnecessary updates
      const last = lastInitialVotingRef.current;
      if (
        last &&
        last.upvotes === newVoting.upvotes &&
        last.downvotes === newVoting.downvotes &&
        last.userVote === newVoting.userVote
      ) {
        // Values haven't changed, skip update
        return;
      }
      
      lastInitialVotingRef.current = newVoting;
      
      setVoting((prev) => {
        // Only update if the initial voting state is different from current
        // This prevents unnecessary updates and preserves optimistic updates
        if (
          prev?.upvotes !== newVoting.upvotes ||
          prev?.downvotes !== newVoting.downvotes ||
          prev?.userVote !== newVoting.userVote
        ) {
          return newVoting;
        }
        return prev;
      });
    } else {
      // If initialVoting becomes undefined/null, reset to null
      lastInitialVotingRef.current = null;
      setVoting(null);
    }
  }, [initialVoting, loading]);

  const vote = useCallback(
    async (voteType: "upvote" | "downvote") => {
      if (!blogSlug) return;
      
      // Prevent concurrent requests
      if (loading) {
        console.warn("Vote request already in progress, ignoring duplicate request");
        return;
      }

      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const currentRequestId = ++requestIdRef.current;

      // Capture current state before making changes
      let previousVoting: VoteResult | null = null;
      let isSameVote = false;

      try {
        setLoading(true);
        setError(null);
        isVotingOperationRef.current = true; // Mark voting operation as active
        
        // Get current state and determine action, then apply optimistic update
        setVoting((prev) => {
          // Only update if this is still the latest request
          if (currentRequestId !== requestIdRef.current) {
            return prev; // Stale request, don't update
          }
          
          previousVoting = prev;
          isSameVote = prev?.userVote === voteType;
          
          // Remove vote if clicking the same vote again
          if (isSameVote) {
            if (!prev) return null;
            return {
              upvotes: prev.userVote === "upvote" ? Math.max(0, prev.upvotes - 1) : prev.upvotes,
              downvotes: prev.userVote === "downvote" ? Math.max(0, prev.downvotes - 1) : prev.downvotes,
              userVote: null,
            };
          } else {
            // Add or change vote
            if (!prev) {
              return {
                upvotes: voteType === "upvote" ? 1 : 0,
                downvotes: voteType === "downvote" ? 1 : 0,
                userVote: voteType,
              };
            }
            
            // Remove previous vote counts
            let newUpvotes = prev.upvotes;
            let newDownvotes = prev.downvotes;
            
            if (prev.userVote === "upvote") {
              newUpvotes = Math.max(0, newUpvotes - 1);
            } else if (prev.userVote === "downvote") {
              newDownvotes = Math.max(0, newDownvotes - 1);
            }
            
            // Add new vote
            if (voteType === "upvote") {
              newUpvotes += 1;
            } else {
              newDownvotes += 1;
            }
            
            return {
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: voteType,
            };
          }
        });
        
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Request timeout. Please check your connection and try again."));
          }, REQUEST_TIMEOUT);
        });
        
        // Make API call with timeout
        const apiPromise = isSameVote 
          ? removeVote(blogSlug)
          : voteOnBlog(blogSlug, voteType);
        
        const result = await Promise.race([apiPromise, timeoutPromise]);
        
        // Only update if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          // Update with server response
          setVoting(result);
          // Clear voting operation flag after successful update
          setTimeout(() => {
            isVotingOperationRef.current = false;
          }, 100);
        }
      } catch (err) {
        // Only handle error if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            // Request was cancelled, revert to previous state
            if (previousVoting) {
              setVoting(previousVoting);
            }
            return; // Don't show error for cancelled requests
          }
          
          // Set flag to prevent state sync during error recovery
          isRecoveringFromErrorRef.current = true;
          
          // Revert optimistic update on error (use functional update to ensure stability)
          if (previousVoting) {
            setVoting(() => previousVoting);
          } else {
            // If no previous state, reset to initial voting state
            if (initialVoting) {
              setVoting({
                upvotes: initialVoting.upvotes ?? 0,
                downvotes: initialVoting.downvotes ?? 0,
                userVote: initialVoting.userVote ?? null,
              });
            }
          }
          
          const error = err instanceof Error ? err : new Error("Failed to vote");
          setError(error);
          
          // Clear the error recovery flag after a short delay to allow state to stabilize
          setTimeout(() => {
            isRecoveringFromErrorRef.current = false;
            isVotingOperationRef.current = false; // Clear voting operation flag
          }, 200);
          
          throw error;
        }
      } finally {
        // Only clear loading if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
          abortControllerRef.current = null;
          // Ensure voting operation flag is cleared
          if (!isRecoveringFromErrorRef.current) {
            setTimeout(() => {
              isVotingOperationRef.current = false;
            }, 100);
          }
        }
      }
    },
    [blogSlug, loading]
  );

  const removeVoteAction = useCallback(async () => {
    if (!blogSlug) return;

    try {
      setLoading(true);
      setError(null);
      const result = await removeVote(blogSlug);
      setVoting(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to remove vote");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [blogSlug]);

  return { voting, loading, error, vote, removeVote: removeVoteAction };
}

// Export a helper to convert BlogVoting to VoteResult
export function votingToResult(voting: BlogVoting): VoteResult {
  return {
    upvotes: voting.upvotes,
    downvotes: voting.downvotes,
    userVote: voting.userVote,
  };
}

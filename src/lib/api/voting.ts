/**
 * Voting API
 * 
 * API functions for voting operations.
 */

import { apiClient } from "../api-client";
import type { ApiVoteResponse } from "./types";

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: "upvote" | "downvote" | null;
}

/**
 * Vote on a blog (upvote or downvote)
 */
export async function voteOnBlog(
  slug: string,
  vote: "upvote" | "downvote"
): Promise<VoteResult> {
  const response = await apiClient.post<ApiVoteResponse>(`/blogs/${slug}/vote`, {
    voteType: vote,
  });
  
  return {
    upvotes: response.upvotes,
    downvotes: response.downvotes,
    userVote: response.userVote,
  };
}

/**
 * Remove vote from a blog
 */
export async function removeVote(slug: string): Promise<VoteResult> {
  const response = await apiClient.delete<ApiVoteResponse>(`/blogs/${slug}/vote`);
  
  return {
    upvotes: response.upvotes,
    downvotes: response.downvotes,
    userVote: response.userVote,
  };
}

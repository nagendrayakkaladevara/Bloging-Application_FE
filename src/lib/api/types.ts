/**
 * API Types
 * 
 * Type definitions matching the backend API response structure.
 */

// Blog API Types
export interface ApiBlog {
  slug: string;
  meta: {
    title: string;
    description: string;
    author: string;
    publishedAt: string;
    readTime: number;
    coverImage?: string;
  };
  layout: {
    type: "single-column" | "two-column";
    maxWidth: string;
    showTableOfContents: boolean;
  };
  settings: {
    enableVoting: boolean;
    enableSocialShare: boolean;
    enableComments: boolean;
  };
  tags: string[];
  links: Array<{
    label: string;
    url: string;
    type: "internal" | "external";
  }>;
  blocks: Array<{
    id: string;
    type: string;
    content: Record<string, unknown>;
  }>;
  voting: {
    enabled: boolean;
    upvotes: number;
    downvotes: number;
    userVote: "upvote" | "downvote" | null;
  };
  socialShare: {
    enabled: boolean;
    platforms: string[];
  };
}

export interface ApiBlogPreview {
  slug: string;
  meta: {
    title: string;
    description: string;
    author: string;
    publishedAt: string;
    readTime: number;
    coverImage?: string;
  };
  tags: string[];
}

export interface ApiPaginatedBlogs {
  blogs: ApiBlogPreview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Comment API Types
export interface ApiComment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
}

export interface ApiCommentsResponse {
  comments: ApiComment[];
}

export interface ApiCreateCommentRequest {
  name: string;
  comment: string;
}

// Vote API Types
export interface ApiVoteResponse {
  upvotes: number;
  downvotes: number;
  userVote: "upvote" | "downvote" | null;
}

// Search API Types
export interface ApiSearchResult {
  blogs: ApiBlogPreview[];
  total: number;
}

// Tag API Types
export interface ApiTag {
  slug: string;
  name: string;
  count: number;
}

export interface ApiTagsResponse {
  tags: ApiTag[];
}

export interface ApiTagBlogsResponse {
  blogs: ApiBlogPreview[];
  tag: ApiTag;
}

// Calendar API Types
export interface ApiCalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime?: string; // Format: "HH:mm"
  endTime?: string; // Format: "HH:mm"
  color?: string;
  blogId?: string;
}

export interface ApiCalendarEventsResponse {
  events: ApiCalendarEvent[];
}

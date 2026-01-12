/**
 * Blog Schema Types
 * 
 * Strongly typed definitions for the configuration-driven blog platform.
 * All types match the exact JSON schema structure from the backend.
 */

// ============================================================================
// Meta Information
// ============================================================================

export interface BlogMeta {
  title: string;
  description: string;
  author: string;
  publishedAt: string; // ISO date string
  readTime: number; // minutes
  coverImage?: string;
}

// ============================================================================
// Layout Configuration
// ============================================================================

export type LayoutType = "single-column" | "two-column";

export interface BlogLayout {
  type: LayoutType;
  maxWidth: string; // e.g., "1200px", "100%"
  showTableOfContents: boolean;
}

// ============================================================================
// Settings
// ============================================================================

export interface BlogSettings {
  enableVoting: boolean;
  enableSocialShare: boolean;
  enableComments: boolean;
}

// ============================================================================
// Links
// ============================================================================

export type LinkType = "internal" | "external";

export interface BlogLink {
  label: string;
  url: string;
  type: LinkType;
}

// ============================================================================
// Voting
// ============================================================================

export type UserVote = "upvote" | "downvote" | null;

export interface BlogVoting {
  enabled: boolean;
  upvotes: number;
  downvotes: number;
  userVote: UserVote;
}

// ============================================================================
// Social Share
// ============================================================================

export type SocialPlatform = "twitter" | "facebook" | "linkedin" | "reddit" | "copy";

export interface BlogSocialShare {
  enabled: boolean;
  platforms: SocialPlatform[];
}

// ============================================================================
// Block Types
// ============================================================================

export type BlockType =
  | "heading"
  | "paragraph"
  | "code"
  | "image"
  | "callout"
  | "list"
  | "quote"
  | "divider";

// Base block interface
export interface BaseBlock {
  id: string;
  type: BlockType;
}

// Heading block
export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

// Paragraph block
export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  text: string;
}

// Code block
export interface CodeBlock extends BaseBlock {
  type: "code";
  code: string;
  language?: string;
  filename?: string;
}

// Image block
export interface ImageBlock extends BaseBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

// Callout block
export type CalloutType = "info" | "warning" | "error" | "success";

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  variant: CalloutType;
  title?: string;
  content: string;
}

// List block
export type ListStyle = "ordered" | "unordered";

export interface ListBlock extends BaseBlock {
  type: "list";
  style: ListStyle;
  items: string[];
}

// Quote block
export interface QuoteBlock extends BaseBlock {
  type: "quote";
  text: string;
  author?: string;
}

// Divider block
export interface DividerBlock extends BaseBlock {
  type: "divider";
}

// Union type for all blocks
export type BlogBlock =
  | HeadingBlock
  | ParagraphBlock
  | CodeBlock
  | ImageBlock
  | CalloutBlock
  | ListBlock
  | QuoteBlock
  | DividerBlock;

// ============================================================================
// Complete Blog Schema
// ============================================================================

export interface Blog {
  meta: BlogMeta;
  layout: BlogLayout;
  settings: BlogSettings;
  tags: string[];
  links: BlogLink[];
  blocks: BlogBlock[];
  voting: BlogVoting;
  socialShare: BlogSocialShare;
}

// ============================================================================
// Blog Preview (for catalogue/home page)
// ============================================================================

export interface BlogPreview {
  id: string;
  meta: BlogMeta;
  tags: string[];
}


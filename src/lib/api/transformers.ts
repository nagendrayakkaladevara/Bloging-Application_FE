/**
 * API Transformers
 * 
 * Transform API responses to match frontend types.
 */

import type { Blog, BlogPreview, BlogBlock } from "@/types/blog";
import type { CalendarEvent } from "@/types/calendar";
import type { Comment } from "@/components/blog/Comments";
import type {
  ApiBlog,
  ApiBlogPreview,
  ApiComment,
  ApiCalendarEvent,
} from "./types";

/**
 * Transform API block content to frontend block format
 */
function transformBlock(apiBlock: ApiBlog["blocks"][0]): BlogBlock {
  const { type, content } = apiBlock;

  switch (type) {
    case "heading":
      return {
        id: apiBlock.id,
        type: "heading",
        level: (content.level as 1 | 2 | 3 | 4 | 5 | 6) || 2,
        text: (content.text as string) || "",
      };

    case "paragraph":
      return {
        id: apiBlock.id,
        type: "paragraph",
        text: (content.text as string) || "",
      };

    case "code":
      return {
        id: apiBlock.id,
        type: "code",
        code: (content.code as string) || "",
        language: (content.language as string) || undefined,
        filename: (content.filename as string) || undefined,
      };

    case "image":
      return {
        id: apiBlock.id,
        type: "image",
        src: (content.src as string) || "",
        alt: (content.alt as string) || "",
        caption: (content.caption as string) || undefined,
      };

    case "callout":
      return {
        id: apiBlock.id,
        type: "callout",
        variant: (content.variant as "info" | "warning" | "error" | "success") || "info",
        title: (content.title as string) || undefined,
        content: (content.content as string) || "",
      };

    case "list":
      return {
        id: apiBlock.id,
        type: "list",
        style: (content.style as "ordered" | "unordered") || "unordered",
        items: (content.items as string[]) || [],
      };

    case "quote":
      return {
        id: apiBlock.id,
        type: "quote",
        text: (content.text as string) || "",
        author: (content.author as string) || undefined,
      };

    case "divider":
      return {
        id: apiBlock.id,
        type: "divider",
      };

    default:
      // Fallback for unknown block types
      return {
        id: apiBlock.id,
        type: "paragraph",
        text: `Unknown block type: ${type}`,
      };
  }
}

/**
 * Transform API blog to frontend Blog type
 */
export function transformBlog(apiBlog: ApiBlog): Blog {
  return {
    meta: apiBlog.meta,
    layout: apiBlog.layout,
    settings: apiBlog.settings,
    tags: apiBlog.tags,
    links: apiBlog.links,
    blocks: apiBlog.blocks.map(transformBlock),
    voting: apiBlog.voting,
    socialShare: apiBlog.socialShare,
  };
}

/**
 * Transform API blog preview to frontend BlogPreview type
 */
export function transformBlogPreview(apiPreview: ApiBlogPreview): BlogPreview {
  return {
    id: apiPreview.slug,
    meta: apiPreview.meta,
    tags: apiPreview.tags,
  };
}

/**
 * Transform API comment to frontend Comment type
 */
export function transformComment(apiComment: ApiComment): Comment {
  // Ensure all required fields are present with fallbacks
  return {
    id: apiComment.id || "",
    name: apiComment.name || "Anonymous",
    comment: apiComment.comment || "",
    createdAt: apiComment.createdAt || new Date().toISOString(),
  };
}

/**
 * Transform API calendar event to frontend CalendarEvent type
 */
export function transformCalendarEvent(apiEvent: ApiCalendarEvent): CalendarEvent {
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description,
    date: new Date(apiEvent.date),
    startTime: apiEvent.startTime,
    endTime: apiEvent.endTime,
    color: apiEvent.color,
    blogId: apiEvent.blogId,
  };
}

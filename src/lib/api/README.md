# API Integration Documentation

This directory contains the API integration layer for the blog application.

## Structure

- `api-client.ts` - Base API client with error handling
- `types.ts` - TypeScript types matching backend API responses
- `transformers.ts` - Transform API responses to frontend types
- `blogs.ts` - Blog-related API functions
- `voting.ts` - Voting API functions
- `comments.ts` - Comments API functions
- `search.ts` - Search API functions
- `tags.ts` - Tags API functions
- `calendar.ts` - Calendar events API functions
- `index.ts` - Central export point

## Configuration

The API base URL is configured via environment variable:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

If not set, it defaults to `http://localhost:3000/api/v1`.

## Usage

### Using API Functions Directly

```typescript
import { getBlogs, getBlogBySlug, voteOnBlog } from "@/lib/api";

// Get all blogs
const blogs = await getBlogs({ page: 1, limit: 10 });

// Get a single blog
const blog = await getBlogBySlug("my-blog-slug");

// Vote on a blog
const result = await voteOnBlog("my-blog-slug", "upvote");
```

### Using React Hooks

```typescript
import { useBlogs, useBlog, useComments, useVoting } from "@/hooks";

// In a component
function MyComponent() {
  const { blogs, loading, error } = useBlogs();
  const { blog, loading, error } = useBlog(blogId);
  const { comments, createComment } = useComments(blogSlug, true);
  const { vote } = useVoting(blogSlug);
  
  // ...
}
```

## Error Handling

All API functions throw `ApiError` instances with:
- `code`: Error code string
- `message`: Human-readable error message
- `statusCode`: HTTP status code (if available)
- `details`: Additional error details

```typescript
import { ApiError } from "@/lib/api";

try {
  await getBlogBySlug("slug");
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code, error.message);
  }
}
```

## Response Transformation

API responses are automatically transformed to match frontend types:
- API block format → Frontend block format
- API blog format → Frontend Blog type
- API comment format → Frontend Comment type
- API calendar event format → Frontend CalendarEvent type

## Rate Limiting

The API has rate limits:
- Public: 100 requests/minute
- Comments: 5/hour

The client doesn't automatically handle rate limiting, but errors will include rate limit information when exceeded.

## Edge Cases Handled

1. **Network Errors**: Gracefully handled with user-friendly messages
2. **404 Errors**: Return null/empty arrays instead of throwing
3. **Loading States**: All hooks provide loading states
4. **Error States**: All hooks provide error states
5. **Empty States**: Components handle empty data gracefully
6. **Optimistic Updates**: Voting uses optimistic updates for better UX

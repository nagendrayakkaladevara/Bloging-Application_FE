You are a staff software developer with 15 years of experience in backend development. You build application with production level architecture.here is the requirement documentation: 

# Backend Requirements Document
## Blog Platform API

**Version:** 1.0  
**Date:** 2024  
**Technology Stack:** Express.js, TypeScript, PostgreSQL neon database  
**Frontend:** React + TypeScript

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Validation Rules](#validation-rules)
7. [Additional Requirements](#additional-requirements)

---

## Overview

This document outlines the backend API requirements for a configuration-driven blog platform. The backend should provide RESTful APIs to support:

- Blog content management (read-only for public)
- Voting system (anonymous, IP-based)
- Search functionality
- Calendar events management
- AI chat integration (future)

**Note:** This platform is open to all users. No authentication or user accounts are required.

### Base URL
```
Production: https://api.yourdomain.com/v1
Development: http://localhost:3000/api/v1
```

### Response Format
All API responses should follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## Database Schema

### Tables

#### 1. `blogs`
```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier
  title VARCHAR(500) NOT NULL,
  description TEXT,
  author VARCHAR(255), -- Author name as string (no user reference)
  cover_image_url TEXT,
  published_at TIMESTAMP,
  read_time INTEGER, -- in minutes
  layout_type VARCHAR(50) DEFAULT 'single-column', -- 'single-column', 'two-column'
  max_width VARCHAR(50) DEFAULT '800px',
  show_table_of_contents BOOLEAN DEFAULT false,
  enable_voting BOOLEAN DEFAULT true,
  enable_social_share BOOLEAN DEFAULT true,
  enable_comments BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'published', -- 'published', 'archived'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
```

#### 2. `blog_blocks`
```sql
CREATE TABLE blog_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL, -- 'heading', 'paragraph', 'code', 'image', 'callout', 'list', 'quote', 'divider'
  block_order INTEGER NOT NULL,
  content JSONB NOT NULL, -- Flexible JSON structure based on block_type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_blocks_blog_id ON blog_blocks(blog_id);
CREATE INDEX idx_blog_blocks_order ON blog_blocks(blog_id, block_order);
```

#### 3. `tags`
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);
```

#### 4. `blog_tags`
```sql
CREATE TABLE blog_tags (
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

CREATE INDEX idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX idx_blog_tags_tag_id ON blog_tags(tag_id);
```

#### 5. `blog_links`
```sql
CREATE TABLE blog_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  link_type VARCHAR(50) DEFAULT 'external', -- 'internal', 'external'
  link_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_links_blog_id ON blog_links(blog_id);
```

#### 6. `blog_votes`
```sql
CREATE TABLE blog_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  ip_address VARCHAR(45), -- IPv4 or IPv6 address
  session_id VARCHAR(255), -- Optional session identifier
  vote_type VARCHAR(20) NOT NULL, -- 'upvote', 'downvote'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blog_id, ip_address, session_id)
);

CREATE INDEX idx_blog_votes_blog_id ON blog_votes(blog_id);
CREATE INDEX idx_blog_votes_ip ON blog_votes(ip_address);
```

**Note:** Voting is anonymous and tracked by IP address and/or session ID. Users can change their vote, but only one vote per IP/session per blog.

#### 7. `calendar_events`
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  color VARCHAR(50) DEFAULT 'blue', -- 'blue', 'green', 'purple', 'orange'
  blog_id UUID REFERENCES blogs(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_blog_id ON calendar_events(blog_id);
```

#### 8. `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  ip_address VARCHAR(45), -- IPv4 or IPv6 address for moderation/abuse prevention
  status VARCHAR(50) DEFAULT 'approved', -- 'approved', 'pending', 'spam', 'deleted'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_blog_id ON comments(blog_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_blog_status ON comments(blog_id, status);
```

**Note:** Comments are anonymous and don't require user authentication. IP address is stored for moderation purposes only.

#### 9. `search_history` (Optional - for analytics)
```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(45), -- IPv4 or IPv6 address
  query TEXT NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_ip ON search_history(ip_address);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);
```

**Note:** User preferences (theme, color mode, favorites) are stored client-side in localStorage. No server-side user settings are required.

---

## API Endpoints

### 1. Blog Endpoints

#### GET `/blogs`
Get all published blog previews (for homepage).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `sort` (optional): Sort order - `newest`, `oldest`, `popular` (default: `newest`)
- `tags` (optional): Comma-separated tag slugs to filter by
- `author` (optional): Author username or ID
- `search` (optional): Search query (searches title, description, tags)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": "uuid",
        "slug": "getting-started-with-react-and-typescript",
        "meta": {
          "title": "Getting Started with React and TypeScript",
          "description": "A comprehensive guide...",
          "author": "John Doe",
          "publishedAt": "2024-01-15T10:00:00Z",
          "readTime": 8,
          "coverImage": "https://images.unsplash.com/..."
        },
        "tags": ["React", "TypeScript", "Frontend"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### GET `/blogs/:slug`
Get a single blog by slug with full content.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blog": {
      "id": "uuid",
      "slug": "getting-started-with-react-and-typescript",
      "meta": {
        "title": "Getting Started with React and TypeScript",
        "description": "A comprehensive guide...",
        "author": "John Doe",
        "publishedAt": "2024-01-15T10:00:00Z",
        "readTime": 8,
        "coverImage": "https://images.unsplash.com/..."
      },
      "layout": {
        "type": "two-column",
        "maxWidth": "1200px",
        "showTableOfContents": true
      },
      "settings": {
        "enableVoting": true,
        "enableSocialShare": true,
        "enableComments": true
      },
      "commentsCount": 15, // Total number of approved comments
      "tags": ["React", "TypeScript", "Frontend", "Tutorial"],
      "links": [
        {
          "id": "uuid",
          "label": "Official React Docs",
          "url": "https://react.dev",
          "type": "external"
        }
      ],
      "blocks": [
        {
          "id": "uuid",
          "type": "heading",
          "level": 2,
          "text": "Introduction"
        },
        {
          "id": "uuid",
          "type": "paragraph",
          "text": "React is a powerful..."
        },
        {
          "id": "uuid",
          "type": "code",
          "code": "npm create vite@latest...",
          "language": "bash",
          "filename": null
        }
      ],
      "voting": {
        "enabled": true,
        "upvotes": 42,
        "downvotes": 2,
        "userVote": "upvote" // or "downvote" or null
      },
      "socialShare": {
        "enabled": true,
        "platforms": ["twitter", "facebook", "linkedin", "copy"]
      }
    }
  }
}
```

**Note:** `userVote` is determined by the IP address and/or session ID of the requester.

#### POST `/blogs`
Create a new blog (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "description": "Blog description",
  "slug": "new-blog-post", // Optional, auto-generated from title if not provided
  "coverImage": "https://...",
  "layout": {
    "type": "single-column",
    "maxWidth": "800px",
    "showTableOfContents": false
  },
  "settings": {
    "enableVoting": true,
    "enableSocialShare": true,
    "enableComments": true
  },
  "tags": ["React", "TypeScript"],
  "links": [
    {
      "label": "External Link",
      "url": "https://example.com",
      "type": "external"
    }
  ],
  "blocks": [
    {
      "type": "heading",
      "level": 2,
      "text": "Introduction"
    },
    {
      "type": "paragraph",
      "text": "Content here..."
    }
  ],
  "status": "draft" // or "published"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "blog": { /* full blog object */ }
  },
  "message": "Blog created successfully"
}
```

#### PUT `/blogs/:slug`
Update a blog (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Request Body:** (Same as POST, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "blog": { /* updated blog object */ }
  },
  "message": "Blog updated successfully"
}
```

#### DELETE `/blogs/:slug`
Delete a blog (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### 2. Voting Endpoints

#### POST `/blogs/:slug/vote`
Vote on a blog (upvote or downvote). Anonymous voting based on IP address.

**Request Body:**
```json
{
  "voteType": "upvote" // or "downvote"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "voting": {
      "enabled": true,
      "upvotes": 43,
      "downvotes": 2,
      "userVote": "upvote" // or "downvote" or null, based on IP/session
    }
  },
  "message": "Vote recorded successfully"
}
```

**Note:** The `userVote` field indicates the vote from the current IP/session. Users can change their vote by submitting a new vote.

#### DELETE `/blogs/:slug/vote`
Remove vote from a blog (based on IP/session).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "voting": {
      "enabled": true,
      "upvotes": 42,
      "downvotes": 2,
      "userVote": null
    }
  },
  "message": "Vote removed successfully"
}
```

**Note:** Favorites are managed client-side using localStorage. No backend endpoints are required for favorites.

---

### 3. Comments Endpoints

#### GET `/blogs/:slug/comments`
Get comments for a blog.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sort` (optional): Sort order - `newest`, `oldest` (default: `newest`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "name": "John Doe",
        "comment": "Great article! Very helpful.",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**Note:** Only approved comments are returned. Pending, spam, and deleted comments are excluded.

#### POST `/blogs/:slug/comments`
Add a comment to a blog. No authentication required.

**Request Body:**
```json
{
  "name": "John Doe",
  "comment": "Great article! Very helpful."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "uuid",
      "name": "John Doe",
      "comment": "Great article! Very helpful.",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  },
  "message": "Comment posted successfully"
}
```

**Note:** 
- Comments are automatically approved by default
- IP address is captured server-side for moderation purposes
- Consider implementing rate limiting (e.g., max 5 comments per IP per hour)
- Consider implementing spam detection

#### DELETE `/blogs/:slug/comments/:commentId`
Delete a comment (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Alternative:** Soft delete by updating status to 'deleted' instead of hard delete.

#### PUT `/blogs/:slug/comments/:commentId/status`
Update comment status (admin only - for moderation).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Request Body:**
```json
{
  "status": "approved" // or "pending", "spam", "deleted"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "uuid",
      "name": "John Doe",
      "comment": "Great article!",
      "status": "approved",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  },
  "message": "Comment status updated successfully"
}
```

---

### 4. Search Endpoints

#### GET `/search`
Search blogs.

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page
- `tags` (optional): Filter by tags

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "uuid",
        "slug": "blog-slug",
        "meta": { /* blog meta */ },
        "tags": ["React", "TypeScript"],
        "relevanceScore": 0.95
      }
    ],
    "pagination": { /* pagination info */ },
    "query": "react typescript",
    "totalResults": 25
  }
}
```

**Search Implementation Notes:**
- Search should be full-text search across:
  - Blog title
  - Blog description
  - Blog tags
  - Blog content (from blocks)
- Use PostgreSQL full-text search (tsvector/tsquery) or a search engine like Elasticsearch
- Results should be ranked by relevance
- Support fuzzy matching for typos

---

### 5. Tags Endpoints

#### GET `/tags`
Get all tags.

**Query Parameters:**
- `popular` (optional): Return only popular tags (boolean)
- `limit` (optional): Limit results

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "uuid",
        "name": "React",
        "slug": "react",
        "description": "React framework",
        "blogCount": 15
      }
    ]
  }
}
```

#### GET `/tags/:slug`
Get blogs by tag.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tag": {
      "id": "uuid",
      "name": "React",
      "slug": "react",
      "description": "React framework"
    },
    "blogs": [ /* blog previews */ ],
    "pagination": { /* pagination info */ }
  }
}
```

---

### 6. Calendar Events Endpoints

#### GET `/calendar/events`
Get calendar events.

**Query Parameters:**
- `startDate` (optional): Start date (ISO format, default: current month start)
- `endDate` (optional): End date (ISO format, default: current month end)
- `blogId` (optional): Filter by blog ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Getting Started with React",
        "description": "New blog post published",
        "date": "2024-01-15",
        "startTime": "10:00",
        "endTime": "11:00",
        "color": "blue",
        "blogId": "uuid",
        "blog": {
          "slug": "blog-slug",
          "title": "Blog Title"
        }
      }
    ]
  }
}
```

#### POST `/calendar/events`
Create a calendar event (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Request Body:**
```json
{
  "title": "Blog Review Meeting",
  "description": "Review upcoming blog posts",
  "date": "2024-01-18",
  "startTime": "14:00",
  "endTime": "15:30",
  "color": "green",
  "blogId": "uuid" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "event": { /* full event object */ }
  }
}
```

#### PUT `/calendar/events/:id`
Update a calendar event (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Request Body:** (Same as POST, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "event": { /* updated event object */ }
  }
}
```

#### DELETE `/calendar/events/:id`
Delete a calendar event (admin only - requires API key or admin authentication).

**Headers:**
```
X-API-Key: <admin_api_key>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Note:** User settings (theme, color mode, favorites) are managed client-side using localStorage. No backend endpoints are required for user settings or profiles.

---

## Data Models

### Blog Block Types

The `content` JSONB field in `blog_blocks` should contain different structures based on `block_type`:

#### Heading Block
```json
{
  "level": 2,
  "text": "Introduction"
}
```

#### Paragraph Block
```json
{
  "text": "Content here..."
}
```

#### Code Block
```json
{
  "code": "npm install...",
  "language": "bash",
  "filename": "package.json"
}
```

#### Image Block
```json
{
  "src": "https://images.unsplash.com/...",
  "alt": "Description",
  "caption": "Optional caption"
}
```

#### Callout Block
```json
{
  "variant": "info", // "info", "warning", "error", "success"
  "title": "Pro Tip",
  "content": "Always enable strict mode..."
}
```

#### List Block
```json
{
  "style": "unordered", // "ordered", "unordered"
  "items": [
    "Item 1",
    "Item 2"
  ]
}
```

#### Quote Block
```json
{
  "text": "The best way to learn...",
  "author": "React Community"
}
```

#### Divider Block
```json
{}
```

---

## Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Invalid or missing API key (admin endpoints only) |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict (e.g., duplicate slug) |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

### Example Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "fields": {
        "title": ["Title is required"],
        "email": ["Invalid email format"]
      }
    }
  }
}
```

---

## Validation Rules

### Blog
- `title`: Required, 1-500 characters
- `slug`: Required, unique, URL-friendly (lowercase, hyphens only)
- `description`: Optional, max 2000 characters
- `readTime`: Optional, positive integer
- `layout.type`: Must be "single-column" or "two-column"
- `status`: Must be "published" or "archived"
- `settings.enableComments`: Boolean, default true

### Comment
- `name`: Required, 1-255 characters
- `comment`: Required, 1-5000 characters
- `status`: Must be "approved", "pending", "spam", or "deleted"


### Vote
- `voteType`: Must be "upvote" or "downvote"

### Calendar Event
- `title`: Required, 1-255 characters
- `date`: Required, valid date
- `startTime`: Optional, format "HH:mm"
- `endTime`: Optional, format "HH:mm", must be after startTime if both provided
- `color`: Must be "blue", "green", "purple", or "orange"

---

## Additional Requirements

### 1. Pagination
All list endpoints should support pagination:
- Default page size: 10
- Maximum page size: 50
- Include pagination metadata in response

### 2. Rate Limiting
- Public endpoints: 100 requests per minute per IP
- Admin endpoints: 50 requests per minute per API key
- Use appropriate HTTP headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 3. CORS
- Allow requests from frontend domain
- No authentication credentials required

### 4. File Uploads
- Support image uploads for:
  - Blog cover images
  - Blog block images
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, WebP
- Store files in cloud storage (S3, Cloudinary, etc.) or local filesystem
- Return public URLs in responses
- Admin only (requires API key)

### 5. Slug Generation
- Auto-generate slugs from titles if not provided
- Ensure uniqueness (append number if duplicate)
- Format: lowercase, replace spaces with hyphens, remove special characters

### 6. Read Time Calculation
- Calculate automatically based on content length
- Formula: ~200 words per minute
- Count words from all text blocks

### 7. Search Implementation
- Use PostgreSQL full-text search or external service (Elasticsearch, Algolia)
- Index: title, description, tags, block content
- Support fuzzy matching
- Return relevance scores

### 8. Comments Moderation
- Implement rate limiting: max 5 comments per IP per hour
- Consider implementing spam detection (keyword filtering, link detection)
- Store IP addresses for abuse prevention
- Support comment moderation workflow (approve, reject, mark as spam)
- Optional: Implement CAPTCHA for comment submission

### 9. Caching
- Cache frequently accessed data:
  - Blog previews (5 minutes)
  - Popular tags (15 minutes)
  - User settings (until updated)
- Use local caching
- Include cache headers in responses

### 10. Logging
- Log all API requests
- Log errors with stack traces
- Include request ID for tracing

### 11. Database Migrations
- Use migration tool
- Version control all schema changes
- Support rollback

### 12. Environment Variables
Required environment variables:
```
DATABASE_URL=postgresql://...
ADMIN_API_KEY=... # For admin operations (blog creation, updates, etc.)
NODE_ENV=production|development
PORT=3000
CORS_ORIGIN=https://yourdomain.com
UPLOAD_MAX_SIZE=5242880
```

### 13. API Documentation
- Generate OpenAPI/Swagger documentation
- Include request/response examples
- Document all error codes

### 14. Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Test coverage: minimum 80%

### 15. Security
- Sanitize all user inputs
- Use parameterized queries (prevent SQL injection)
- Validate API keys for admin endpoints
- Implement rate limiting to prevent abuse
- Use HTTPS in production
- Validate IP addresses for voting (prevent spoofing)
- Consider implementing session-based tracking for better vote accuracy

### 16. Performance
- Database query optimization
- Use indexes on frequently queried columns
- Implement connection pooling
- Use transactions for multi-step operations
- Optimize JSONB queries for blog blocks

---

## Future Enhancements
- V2  will be implemented in 2nd version you can make room for it 
### AI Chat Integration (V2)
- Endpoint: `POST /ai/chat`
- Integrate with AI service (OpenAI, Anthropic, etc.)
- Context: Provide blog content for AI responses
- Rate limiting: Stricter limits for AI endpoints

### Analytics
- Track blog views
- Track search queries
- Track popular content
- User engagement metrics

### Comments System (Already Implemented)
- ✅ Add comments to blogs
- ✅ Anonymous comments (name only, no authentication)
- ✅ Comment moderation (approve, reject, spam)
- ⏳ Nested replies (future enhancement)

### Email Notifications (V2)
- New blog notifications
- Weekly digests
- Comment replies

### Email subscription (V2)
- collect mail id's for email notification
---

## Notes for Backend Team

1. **TypeScript Types**: Match the frontend types exactly as defined in `src/types/blog.ts`
2. **Date Format**: Always use ISO 8601 format (e.g., "2024-01-15T10:00:00Z")
3. **Slug Format**: Generate from title: lowercase, hyphens, no special chars
4. **Block Order**: Maintain order using `block_order` field
5. **Vote Updates**: When IP/session changes vote, update existing record, don't create new
6. **Soft Deletes**: Consider soft deletes for blogs (add `deleted_at` column)
7. **Image URLs**: Store full URLs, not relative paths
8. **Search**: Prioritize title matches, then description, then tags
9. **Pagination**: Always include total count for proper pagination UI
10. **Error Messages**: Make error messages user-friendly and actionable
11. **No Authentication**: All public endpoints are open. Only admin operations require API key
12. **Voting**: Track by IP address and optional session ID. One vote per IP/session per blog
13. **Favorites**: Managed client-side in localStorage - no backend storage needed
14. **User Settings**: Managed client-side in localStorage - no backend storage needed
15. **Author Field**: Store as simple string in blogs table, not a foreign key
16. **Comments**: Anonymous comments with name only. IP address stored for moderation. Rate limit: 5 comments per IP per hour
17. **Comment Status**: Default to "approved". Support "pending", "spam", "deleted" for moderation
18. **Comments Count**: Include `commentsCount` in blog responses for quick display

---

## Contact

For questions or clarifications, please contact the frontend team.

**Document Version:** 1.0  
**Last Updated:** 2026

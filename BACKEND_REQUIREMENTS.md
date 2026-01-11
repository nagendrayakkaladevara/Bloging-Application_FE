# Backend Requirements Document
## Blog Platform API

**Version:** 1.0  
**Date:** 2024  
**Technology Stack:** Express.js, TypeScript, PostgreSQL  
**Frontend:** React + TypeScript

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Validation Rules](#validation-rules)
8. [Additional Requirements](#additional-requirements)

---

## Overview

This document outlines the backend API requirements for a configuration-driven blog platform. The backend should provide RESTful APIs to support:

- Blog content management (CRUD operations)
- User voting system
- Favorites management
- Search functionality
- Calendar events management
- User preferences and settings
- AI chat integration (future)

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
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## Database Schema

### Tables

#### 1. `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'author'
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### 2. `blogs`
```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier
  title VARCHAR(500) NOT NULL,
  description TEXT,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_image_url TEXT,
  published_at TIMESTAMP,
  read_time INTEGER, -- in minutes
  layout_type VARCHAR(50) DEFAULT 'single-column', -- 'single-column', 'two-column'
  max_width VARCHAR(50) DEFAULT '800px',
  show_table_of_contents BOOLEAN DEFAULT false,
  enable_voting BOOLEAN DEFAULT true,
  enable_social_share BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
```

#### 3. `blog_blocks`
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

#### 4. `tags`
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

#### 5. `blog_tags`
```sql
CREATE TABLE blog_tags (
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

CREATE INDEX idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX idx_blog_tags_tag_id ON blog_tags(tag_id);
```

#### 6. `blog_links`
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

#### 7. `blog_votes`
```sql
CREATE TABLE blog_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(20) NOT NULL, -- 'upvote', 'downvote'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blog_id, user_id)
);

CREATE INDEX idx_blog_votes_blog_id ON blog_votes(blog_id);
CREATE INDEX idx_blog_votes_user_id ON blog_votes(user_id);
```

#### 8. `user_favorites`
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, blog_id)
);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_blog_id ON user_favorites(blog_id);
```

#### 9. `calendar_events`
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
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_blog_id ON calendar_events(blog_id);
```

#### 10. `user_settings`
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme_name VARCHAR(50) DEFAULT 'default',
  color_mode VARCHAR(20) DEFAULT 'system', -- 'light', 'dark', 'system'
  notifications JSONB DEFAULT '{}', -- Store notification preferences
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

#### 11. `search_history` (Optional - for analytics)
```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);
```

---

## Authentication & Authorization

### Authentication Method
- JWT (JSON Web Tokens)
- Token expiration: 7 days
- Refresh token: 30 days

### Protected Routes
Most endpoints require authentication. Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### User Roles
- **user**: Can read blogs, vote, favorite, search
- **author**: All user permissions + create/edit own blogs
- **admin**: Full access to all resources

---

## API Endpoints

### 1. Authentication Endpoints

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

#### POST `/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

#### POST `/auth/refresh`
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

#### POST `/auth/logout`
Logout user (invalidate tokens).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. Blog Endpoints

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
        "enableSocialShare": true
      },
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

**Note:** `userVote` is only included if user is authenticated.

#### POST `/blogs`
Create a new blog (requires `author` or `admin` role).

**Headers:**
```
Authorization: Bearer <token>
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
    "enableSocialShare": true
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
Update a blog (requires ownership or `admin` role).

**Headers:**
```
Authorization: Bearer <token>
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
Delete a blog (requires ownership or `admin` role).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### 3. Voting Endpoints

#### POST `/blogs/:slug/vote`
Vote on a blog (upvote or downvote).

**Headers:**
```
Authorization: Bearer <token>
```

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
      "userVote": "upvote"
    }
  },
  "message": "Vote recorded successfully"
}
```

#### DELETE `/blogs/:slug/vote`
Remove user's vote from a blog.

**Headers:**
```
Authorization: Bearer <token>
```

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

---

### 4. Favorites Endpoints

#### GET `/users/me/favorites`
Get user's favorite blogs.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "uuid",
        "slug": "blog-slug",
        "meta": { /* blog meta */ },
        "tags": ["React", "TypeScript"],
        "favoritedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

#### POST `/blogs/:slug/favorite`
Add blog to favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Blog added to favorites"
}
```

#### DELETE `/blogs/:slug/favorite`
Remove blog from favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Blog removed from favorites"
}
```

---

### 5. Search Endpoints

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

### 6. Tags Endpoints

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

### 7. Calendar Events Endpoints

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
Create a calendar event (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
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
Update a calendar event.

**Headers:**
```
Authorization: Bearer <token>
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
Delete a calendar event.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### 8. User Settings Endpoints

#### GET `/users/me/settings`
Get user settings.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "themeName": "default",
      "colorMode": "system",
      "notifications": {
        "email": true,
        "blogUpdates": true,
        "sms": false,
        "push": true,
        "dailyReports": true,
        "weeklyReports": false
      }
    }
  }
}
```

#### PUT `/users/me/settings`
Update user settings.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "themeName": "twitter", // optional
  "colorMode": "dark", // optional
  "notifications": { // optional
    "email": true,
    "blogUpdates": true,
    "sms": false,
    "push": true,
    "dailyReports": true,
    "weeklyReports": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "settings": { /* updated settings */ }
  },
  "message": "Settings updated successfully"
}
```

---

### 9. User Profile Endpoints

#### GET `/users/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatarUrl": "https://...",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### PUT `/users/me`
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "newusername", // optional
  "fullName": "New Name", // optional
  "avatarUrl": "https://..." // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* updated user object */ }
  }
}
```

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
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
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
- `status`: Must be "draft", "published", or "archived"

### User
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain letter and number
- `username`: Optional, 3-50 characters, alphanumeric and underscores only, unique

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
- Authenticated endpoints: 200 requests per minute per user
- Use appropriate HTTP headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 3. CORS
- Allow requests from frontend domain
- Support credentials (cookies, authorization headers)

### 4. File Uploads
- Support image uploads for:
  - User avatars
  - Blog cover images
  - Blog block images
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, WebP
- Store files in cloud storage (S3, Cloudinary, etc.) or local filesystem
- Return public URLs in responses

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

### 8. Caching
- Cache frequently accessed data:
  - Blog previews (5 minutes)
  - Popular tags (15 minutes)
  - User settings (until updated)
- Use Redis or similar
- Include cache headers in responses

### 9. Logging
- Log all API requests
- Log errors with stack traces
- Include request ID for tracing

### 10. Database Migrations
- Use migration tool (e.g., Knex.js, TypeORM migrations)
- Version control all schema changes
- Support rollback

### 11. Environment Variables
Required environment variables:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
NODE_ENV=production|development
PORT=3000
CORS_ORIGIN=https://yourdomain.com
UPLOAD_MAX_SIZE=5242880
REDIS_URL=redis://...
```

### 12. API Documentation
- Generate OpenAPI/Swagger documentation
- Include request/response examples
- Document all error codes

### 13. Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Test coverage: minimum 80%

### 14. Security
- Hash passwords using bcrypt (cost factor: 10)
- Sanitize all user inputs
- Use parameterized queries (prevent SQL injection)
- Validate JWT tokens
- Implement CSRF protection
- Use HTTPS in production
- Set secure cookie flags

### 15. Performance
- Database query optimization
- Use indexes on frequently queried columns
- Implement connection pooling
- Use transactions for multi-step operations
- Optimize JSONB queries for blog blocks

---

## Future Enhancements

### AI Chat Integration
- Endpoint: `POST /ai/chat`
- Integrate with AI service (OpenAI, Anthropic, etc.)
- Context: Provide blog content for AI responses
- Rate limiting: Stricter limits for AI endpoints

### Analytics
- Track blog views
- Track search queries
- Track popular content
- User engagement metrics

### Comments System
- Add comments to blogs
- Nested replies
- Moderation

### Email Notifications
- New blog notifications
- Weekly digests
- Comment replies

---

## Notes for Backend Team

1. **TypeScript Types**: Match the frontend types exactly as defined in `src/types/blog.ts`
2. **Date Format**: Always use ISO 8601 format (e.g., "2024-01-15T10:00:00Z")
3. **Slug Format**: Generate from title: lowercase, hyphens, no special chars
4. **Block Order**: Maintain order using `block_order` field
5. **Vote Updates**: When user changes vote, update existing record, don't create new
6. **Soft Deletes**: Consider soft deletes for blogs (add `deleted_at` column)
7. **Image URLs**: Store full URLs, not relative paths
8. **Search**: Prioritize title matches, then description, then tags
9. **Pagination**: Always include total count for proper pagination UI
10. **Error Messages**: Make error messages user-friendly and actionable

---

## Contact

For questions or clarifications, please contact the frontend team.

**Document Version:** 1.0  
**Last Updated:** 2024

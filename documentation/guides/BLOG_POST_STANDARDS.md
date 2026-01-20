# Blog Post Standards Document

This document defines the standards and requirements for blog post data structures that the frontend accepts without breaking. All blog posts must conform to these specifications to ensure proper rendering and functionality.

## Table of Contents

1. [API Response Structure](#api-response-structure)
2. [Blog Post Schema](#blog-post-schema)
3. [Block Types](#block-types)
4. [Data Validation Rules](#data-validation-rules)
5. [Breaking Changes](#breaking-changes)
6. [Examples](#examples)

---

## API Response Structure

### Expected Response Format

The API must return blog posts in the following structure:

```json
{
  "success": true,
  "data": {
    "blog": {
      // Blog post data (see schema below)
    }
  }
}
```

**Important**: The frontend expects the blog to be nested under `data.blog`. If the blog is returned directly in `data`, the frontend will fail to parse it.

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

---

## Blog Post Schema

### Root Blog Object

```typescript
{
  slug: string;                    // REQUIRED: Unique identifier (URL-friendly)
  meta: BlogMeta;                  // REQUIRED: Metadata object
  layout: BlogLayout;              // REQUIRED: Layout configuration
  settings: BlogSettings;          // REQUIRED: Feature settings
  tags: string[];                   // REQUIRED: Array of tag strings (can be empty)
  links: BlogLink[];                // REQUIRED: Array of links (can be empty)
  blocks: BlogBlock[];              // REQUIRED: Array of content blocks (cannot be empty)
  voting: BlogVoting;               // REQUIRED: Voting configuration
  socialShare: BlogSocialShare;     // REQUIRED: Social share configuration
}
```

### BlogMeta Object

```typescript
{
  title: string;                    // REQUIRED: Blog post title (non-empty)
  description: string;              // REQUIRED: Short description (non-empty)
  author: string;                   // REQUIRED: Author name (non-empty)
  publishedAt: string;              // REQUIRED: ISO 8601 date string (e.g., "2024-01-15T10:00:00Z")
  readTime: number;                 // REQUIRED: Reading time in minutes (integer, >= 0)
  coverImage?: string;              // OPTIONAL: URL to cover image
}
```

**Validation Rules:**
- `title`: Must be a non-empty string (min 1 character, max 200 characters recommended)
- `description`: Must be a non-empty string (min 1 character, max 500 characters recommended)
- `author`: Must be a non-empty string
- `publishedAt`: Must be a valid ISO 8601 date string
- `readTime`: Must be a non-negative integer
- `coverImage`: If provided, must be a valid URL string

### BlogLayout Object

```typescript
{
  type: "single-column" | "two-column";  // REQUIRED: Layout type
  maxWidth: string;                       // REQUIRED: CSS width value (e.g., "1200px", "100%")
  showTableOfContents: boolean;           // REQUIRED: Whether to show TOC
}
```

**Validation Rules:**
- `type`: Must be exactly `"single-column"` or `"two-column"`
- `maxWidth`: Must be a valid CSS width value (e.g., "1200px", "100%", "80ch")
- `showTableOfContents`: Must be a boolean

### BlogSettings Object

```typescript
{
  enableVoting: boolean;           // REQUIRED: Enable/disable voting
  enableSocialShare: boolean;       // REQUIRED: Enable/disable social sharing
  enableComments: boolean;           // REQUIRED: Enable/disable comments
}
```

**Validation Rules:**
- All fields must be boolean values

### BlogLink Object

```typescript
{
  label: string;                    // REQUIRED: Display text for the link
  url: string;                      // REQUIRED: Link URL
  type: "internal" | "external";    // REQUIRED: Link type
}
```

**Validation Rules:**
- `label`: Must be a non-empty string
- `url`: Must be a valid URL string
- `type`: Must be exactly `"internal"` or `"external"`

### BlogVoting Object

```typescript
{
  enabled: boolean;                 // REQUIRED: Whether voting is enabled
  upvotes: number;                   // REQUIRED: Number of upvotes (integer, >= 0)
  downvotes: number;                 // REQUIRED: Number of downvotes (integer, >= 0)
  userVote: "upvote" | "downvote" | null;  // REQUIRED: Current user's vote
}
```

**Validation Rules:**
- `enabled`: Must be a boolean
- `upvotes`: Must be a non-negative integer
- `downvotes`: Must be a non-negative integer
- `userVote`: Must be exactly `"upvote"`, `"downvote"`, or `null`

### BlogSocialShare Object

```typescript
{
  enabled: boolean;                 // REQUIRED: Whether social sharing is enabled
  platforms: string[];               // REQUIRED: Array of platform strings
}
```

**Validation Rules:**
- `enabled`: Must be a boolean
- `platforms`: Must be an array of strings (can be empty)
- Valid platform values: `"twitter"`, `"facebook"`, `"linkedin"`, `"reddit"`, `"copy"`

---

## Block Types

All blocks must have the following base structure:

```typescript
{
  id: string;                        // REQUIRED: Unique identifier for the block
  type: BlockType;                   // REQUIRED: Block type (see below)
  content: Record<string, unknown>; // REQUIRED: Block-specific content
}
```

### Supported Block Types

#### 1. Heading Block

**Type:** `"heading"`

**Content Structure:**
```typescript
{
  level: 1 | 2 | 3 | 4 | 5 | 6;  // REQUIRED: Heading level (1-6)
  text: string;                    // REQUIRED: Heading text (non-empty)
}
```

**Example:**
```json
{
  "id": "block-1",
  "type": "heading",
  "content": {
    "level": 2,
    "text": "Introduction to React"
  }
}
```

**Validation Rules:**
- `level`: Must be an integer between 1 and 6
- `text`: Must be a non-empty string
- If `level` is missing or invalid, defaults to `2`
- If `text` is missing, defaults to empty string

---

#### 2. Paragraph Block

**Type:** `"paragraph"`

**Content Structure:**
```typescript
{
  text: string;  // REQUIRED: Paragraph text (can be empty)
}
```

**Example:**
```json
{
  "id": "block-2",
  "type": "paragraph",
  "content": {
    "text": "This is a paragraph of text that will be rendered in the blog post."
  }
}
```

**Validation Rules:**
- `text`: Must be a string (can be empty)
- If `text` is missing, defaults to empty string

---

#### 3. Code Block

**Type:** `"code"`

**Content Structure:**
```typescript
{
  code: string;        // REQUIRED: Code content (can be empty)
  language?: string;    // OPTIONAL: Programming language identifier
  filename?: string;    // OPTIONAL: Filename to display
}
```

**Example:**
```json
{
  "id": "block-3",
  "type": "code",
  "content": {
    "code": "function hello() {\n  console.log('Hello, World!');\n}",
    "language": "javascript",
    "filename": "hello.js"
  }
}
```

**Validation Rules:**
- `code`: Must be a string (can be empty)
- `language`: If provided, must be a string (e.g., "javascript", "python", "bash")
- `filename`: If provided, must be a string
- If `code` is missing, defaults to empty string

---

#### 4. Image Block

**Type:** `"image"`

**Content Structure:**
```typescript
{
  src: string;          // REQUIRED: Image URL
  alt: string;          // REQUIRED: Alt text for accessibility
  caption?: string;     // OPTIONAL: Image caption
}
```

**Example:**
```json
{
  "id": "block-4",
  "type": "image",
  "content": {
    "src": "https://example.com/image.jpg",
    "alt": "A beautiful sunset",
    "caption": "Sunset over the mountains"
  }
}
```

**Validation Rules:**
- `src`: Must be a valid URL string (non-empty)
- `alt`: Must be a string (required for accessibility, can be empty)
- `caption`: If provided, must be a string
- If `src` is missing, the image will fail to load
- If `alt` is missing, defaults to empty string

---

#### 5. Callout Block

**Type:** `"callout"`

**Content Structure:**
```typescript
{
  variant: "info" | "warning" | "error" | "success";  // REQUIRED: Callout type
  title?: string;      // OPTIONAL: Callout title
  content: string;     // REQUIRED: Callout content text
}
```

**Example:**
```json
{
  "id": "block-5",
  "type": "callout",
  "content": {
    "variant": "warning",
    "title": "Important Notice",
    "content": "This feature is currently in beta."
  }
}
```

**Validation Rules:**
- `variant`: Must be exactly `"info"`, `"warning"`, `"error"`, or `"success"`
- `title`: If provided, must be a string
- `content`: Must be a string (can be empty)
- If `variant` is missing or invalid, defaults to `"info"`
- If `content` is missing, defaults to empty string

---

#### 6. List Block

**Type:** `"list"`

**Content Structure:**
```typescript
{
  style: "ordered" | "unordered";  // REQUIRED: List style
  items: string[];                 // REQUIRED: Array of list items
}
```

**Example:**
```json
{
  "id": "block-6",
  "type": "list",
  "content": {
    "style": "unordered",
    "items": [
      "First item",
      "Second item",
      "Third item"
    ]
  }
}
```

**Validation Rules:**
- `style`: Must be exactly `"ordered"` or `"unordered"`
- `items`: Must be an array of strings (can be empty array)
- If `style` is missing or invalid, defaults to `"unordered"`
- If `items` is missing, defaults to empty array
- Each item in `items` must be a string

---

#### 7. Quote Block

**Type:** `"quote"`

**Content Structure:**
```typescript
{
  text: string;      // REQUIRED: Quote text
  author?: string;    // OPTIONAL: Quote author
}
```

**Example:**
```json
{
  "id": "block-7",
  "type": "quote",
  "content": {
    "text": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  }
}
```

**Validation Rules:**
- `text`: Must be a string (can be empty)
- `author`: If provided, must be a string
- If `text` is missing, defaults to empty string

---

#### 8. Divider Block

**Type:** `"divider"`

**Content Structure:**
```typescript
{}  // No content required
```

**Example:**
```json
{
  "id": "block-8",
  "type": "divider",
  "content": {}
}
```

**Validation Rules:**
- No content fields required
- Used to create a visual separator between sections

---

## Data Validation Rules

### Required Fields

The following fields are **REQUIRED** and must be present in every blog post:

1. `slug` - Must be a non-empty string
2. `meta` - Must be an object with all required meta fields
3. `layout` - Must be an object with all required layout fields
4. `settings` - Must be an object with all required settings fields
5. `tags` - Must be an array (can be empty)
6. `links` - Must be an array (can be empty)
7. `blocks` - Must be a non-empty array (at least one block required)
8. `voting` - Must be an object with all required voting fields
9. `socialShare` - Must be an object with all required social share fields

### Type Validation

- All string fields must be actual strings (not numbers, booleans, or objects)
- All number fields must be actual numbers (not strings)
- All boolean fields must be actual booleans (not strings like `"true"` or `"false"`)
- All array fields must be actual arrays (not objects or strings)
- All object fields must be actual objects (not arrays or primitives)

### Array Validation

- `tags`: Must be an array of strings (can be empty)
- `links`: Must be an array of BlogLink objects (can be empty)
- `blocks`: Must be a non-empty array of block objects
- `platforms`: Must be an array of strings (can be empty)
- `items` (in list blocks): Must be an array of strings (can be empty)

### String Validation

- Non-empty string fields must contain at least one character
- URL fields must be valid URL strings
- Date strings must be valid ISO 8601 format

---

## Breaking Changes

### What Will Break the Frontend

The following scenarios will cause the frontend to fail or display incorrectly:

1. **Missing Required Fields**
   - If any required field is missing, the frontend will fail to render
   - Example: Missing `meta.title` will cause an error

2. **Invalid Block Type**
   - If a block has an unknown `type`, it will be rendered as a paragraph with error text
   - Example: `type: "unknown"` will show "Unknown block type: unknown"

3. **Invalid Data Types**
   - If a field has the wrong type (e.g., string instead of number), the frontend may crash
   - Example: `readTime: "5"` (string) instead of `readTime: 5` (number)

4. **Invalid Block Structure**
   - If a block is missing `id` or `type`, the frontend will fail
   - If `content` is not an object, the block will fail to render

5. **Empty Blocks Array**
   - If `blocks` is an empty array, the blog post will have no content
   - The frontend requires at least one block

6. **Invalid Nested Structure**
   - If the API response doesn't nest the blog under `data.blog`, the frontend will show "Blog Not Found"
   - The response must be: `{ success: true, data: { blog: {...} } }`

7. **Invalid Enum Values**
   - If enum fields have invalid values, defaults will be used, which may not match expectations
   - Example: `layout.type: "three-column"` (invalid) will cause issues

8. **Malformed URLs**
   - If `coverImage` or image block `src` contains invalid URLs, images will fail to load
   - If `links[].url` contains invalid URLs, links will be broken

9. **Invalid Date Format**
   - If `publishedAt` is not a valid ISO 8601 string, date parsing will fail
   - Example: `"2024-01-15"` (missing time) may cause issues

10. **Circular References or Deep Nesting**
    - Extremely deep nesting or circular references may cause rendering issues
    - Keep data structures flat and simple

### Graceful Degradation

The frontend has some fallback behavior:

- **Unknown block types**: Rendered as paragraph with error message
- **Missing optional fields**: Defaults are applied (e.g., heading level defaults to 2)
- **Empty strings**: Rendered as empty content (may cause layout issues)
- **Invalid enum values**: Defaults are applied (e.g., callout variant defaults to "info")

However, **required fields must always be present** to avoid breaking the frontend.

---

## Examples

### Complete Valid Blog Post

```json
{
  "success": true,
  "data": {
    "blog": {
      "slug": "getting-started-with-react",
      "meta": {
        "title": "Getting Started with React",
        "description": "A comprehensive guide to React development",
        "author": "John Doe",
        "publishedAt": "2024-01-15T10:00:00Z",
        "readTime": 8,
        "coverImage": "https://example.com/cover.jpg"
      },
      "layout": {
        "type": "single-column",
        "maxWidth": "1200px",
        "showTableOfContents": true
      },
      "settings": {
        "enableVoting": true,
        "enableSocialShare": true,
        "enableComments": true
      },
      "tags": ["React", "JavaScript", "Frontend"],
      "links": [
        {
          "label": "Official React Docs",
          "url": "https://react.dev",
          "type": "external"
        }
      ],
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "content": {
            "level": 1,
            "text": "Introduction"
          }
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "content": {
            "text": "React is a powerful JavaScript library for building user interfaces."
          }
        },
        {
          "id": "block-3",
          "type": "code",
          "content": {
            "code": "import React from 'react';\n\nfunction App() {\n  return <h1>Hello, World!</h1>;\n}",
            "language": "javascript",
            "filename": "App.jsx"
          }
        },
        {
          "id": "block-4",
          "type": "callout",
          "content": {
            "variant": "info",
            "title": "Tip",
            "content": "Make sure to install React before starting."
          }
        },
        {
          "id": "block-5",
          "type": "list",
          "content": {
            "style": "ordered",
            "items": [
              "Install Node.js",
              "Create a new React app",
              "Start the development server"
            ]
          }
        },
        {
          "id": "block-6",
          "type": "image",
          "content": {
            "src": "https://example.com/react-logo.png",
            "alt": "React logo",
            "caption": "The React logo"
          }
        },
        {
          "id": "block-7",
          "type": "quote",
          "content": {
            "text": "React makes it painless to create interactive UIs.",
            "author": "React Team"
          }
        },
        {
          "id": "block-8",
          "type": "divider",
          "content": {}
        }
      ],
      "voting": {
        "enabled": true,
        "upvotes": 42,
        "downvotes": 2,
        "userVote": null
      },
      "socialShare": {
        "enabled": true,
        "platforms": ["twitter", "facebook", "linkedin", "copy"]
      }
    }
  }
}
```

### Minimal Valid Blog Post

```json
{
  "success": true,
  "data": {
    "blog": {
      "slug": "minimal-blog",
      "meta": {
        "title": "Minimal Blog",
        "description": "A minimal blog post",
        "author": "Author",
        "publishedAt": "2024-01-15T10:00:00Z",
        "readTime": 1
      },
      "layout": {
        "type": "single-column",
        "maxWidth": "1200px",
        "showTableOfContents": false
      },
      "settings": {
        "enableVoting": false,
        "enableSocialShare": false,
        "enableComments": false
      },
      "tags": [],
      "links": [],
      "blocks": [
        {
          "id": "block-1",
          "type": "paragraph",
          "content": {
            "text": "This is a minimal blog post."
          }
        }
      ],
      "voting": {
        "enabled": false,
        "upvotes": 0,
        "downvotes": 0,
        "userVote": null
      },
      "socialShare": {
        "enabled": false,
        "platforms": []
      }
    }
  }
}
```

---

## Best Practices

1. **Always validate data** before sending to the frontend
2. **Use TypeScript** or JSON Schema validation on the backend
3. **Provide meaningful defaults** for optional fields
4. **Test with edge cases** (empty strings, null values, etc.)
5. **Keep block IDs unique** within a blog post
6. **Sanitize user input** before storing in blocks
7. **Validate URLs** before including them in links or images
8. **Use proper date formats** (ISO 8601)
9. **Limit string lengths** to prevent UI issues
10. **Test the frontend** with your blog post data before deploying

---

## Version History

- **v1.0.0** (2024-01-15): Initial standards document
  - Defined all block types
  - Established validation rules
  - Documented breaking changes

---

## Support

If you encounter issues with blog post rendering, check:

1. Browser console for JavaScript errors
2. Network tab for API response structure
3. This document for validation requirements
4. Type definitions in `src/types/blog.ts`
5. Transformer logic in `src/lib/api/transformers.ts`

For questions or issues, refer to the main project documentation or contact the development team.

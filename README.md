# Blog Platform v1.0

A production-ready, configuration-driven blogging platform built with modern web technologies.

## 🚀 Features

- **Configuration-Driven Rendering**: Blog UI is generated entirely from backend JSON schema - no hard-coded layouts
- **Block-Based Content System**: Flexible block rendering with 8 different block types
- **Dynamic Layouts**: Support for single-column and two-column layouts with configurable max-width
- **Feature Toggles**: Conditional rendering for voting, social sharing, and table of contents
- **Type-Safe**: Full TypeScript support with strong typing for all blog schemas
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with clean, modern typography

## 📋 Tech Stack

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM 7.11
- **Icons**: Lucide React

## 🏗️ Project Structure

```
src/
├── components/
│   ├── blocks/          # Block rendering components (8 types)
│   │   ├── HeadingBlock.tsx
│   │   ├── ParagraphBlock.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── CalloutBlock.tsx
│   │   ├── ListBlock.tsx
│   │   ├── QuoteBlock.tsx
│   │   ├── DividerBlock.tsx
│   │   └── index.tsx    # BLOCK_MAP registry
│   ├── blog/            # Blog-specific components
│   │   ├── BlogRenderer.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── Voting.tsx
│   │   └── SocialShare.tsx
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── separator.tsx
│   └── BlogPageWrapper.tsx
├── pages/               # Page components
│   ├── HomePage.tsx     # Blog catalogue
│   └── BlogPage.tsx     # Single blog view
├── types/               # TypeScript type definitions
│   └── blog.ts          # Complete blog schema types
├── data/                # Mock data (replace with API calls)
│   └── mockBlogs.ts
└── lib/                 # Utility functions
    └── utils.ts         # cn() helper for class merging
```

## 🎯 Block Types

The platform supports 8 different block types:

1. **Heading** - H1-H6 headings with configurable levels
2. **Paragraph** - Text paragraphs
3. **Code** - Code blocks with syntax highlighting support
4. **Image** - Images with optional captions
5. **Callout** - Alert-style callouts (info, warning, error, success)
6. **List** - Ordered and unordered lists
7. **Quote** - Blockquotes with optional author attribution
8. **Divider** - Horizontal dividers

## 📐 Layout System

### Single Column Layout
- Full-width content area
- Configurable max-width
- Optional table of contents (if enabled)

### Two Column Layout
- Main content area (2/3 width)
- Sidebar with table of contents (1/3 width)
- Responsive: collapses to single column on mobile

## 🔧 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Blog Schema

The blog JSON follows this structure:

```typescript
{
  meta: {
    title: string;
    description: string;
    author: string;
    publishedAt: string; // ISO date
    readTime: number; // minutes
    coverImage?: string;
  },
  layout: {
    type: "single-column" | "two-column";
    maxWidth: string;
    showTableOfContents: boolean;
  },
  settings: {
    enableVoting: boolean;
    enableSocialShare: boolean;
  },
  tags: string[];
  links: Array<{ label: string; url: string; type: "internal" | "external" }>;
  blocks: BlogBlock[]; // Array of block objects
  voting: {
    enabled: boolean;
    upvotes: number;
    downvotes: number;
    userVote: "upvote" | "downvote" | null;
  },
  socialShare: {
    enabled: boolean;
    platforms: ("twitter" | "facebook" | "linkedin" | "reddit" | "copy")[];
  }
}
```

## 🔌 API Integration

Currently, the app uses mock data from `src/data/mockBlogs.ts`. To connect to a backend API:

1. Replace `getBlogPreviews()` and `getBlogById()` functions
2. Update the functions to fetch from your API endpoints
3. The TypeScript types are already defined - just match the JSON structure

Example:

```typescript
// src/data/api.ts
export async function getBlogPreviews(): Promise<BlogPreview[]> {
  const response = await fetch('/api/blogs');
  return response.json();
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const response = await fetch(`/api/blogs/${id}`);
  if (!response.ok) return null;
  return response.json();
}
```

## 🎨 Customization

### Adding New Block Types

1. Define the block type in `src/types/blog.ts`
2. Create a component in `src/components/blocks/`
3. Register it in `src/components/blocks/index.tsx` BLOCK_MAP

### Styling

- Tailwind CSS configuration: `tailwind.config.js`
- Global styles: `src/index.css`
- Component styles: Use Tailwind utility classes

### Theme

The app uses CSS variables for theming. Modify `src/index.css` to change colors:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}
```

## 🧪 Development

### Code Quality

```bash
# Run linter
npm run lint

# Type checking
npm run build
```

### Best Practices

- ✅ Always use `block.id` as React key (never array index)
- ✅ Use `import type` for TypeScript types
- ✅ Handle unknown block types gracefully
- ✅ Follow the configuration-driven architecture
- ✅ Keep components reusable and maintainable

## 📦 Build & Deploy

### Local Build

```bash
# Production build
npm run build

# Output will be in dist/ directory
# Deploy dist/ to your hosting provider
```

### Netlify Deployment

The project includes a `netlify.toml` configuration file for easy deployment to Netlify.

#### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod
```

#### Option 2: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://www.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Netlify will automatically detect the build settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

#### Option 3: Drag & Drop

1. Build the project locally: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

The `netlify.toml` file includes:
- ✅ Build configuration
- ✅ SPA routing redirects (for React Router)
- ✅ Security headers
- ✅ Cache optimization for static assets

## 🗺️ Routes

- `/` - Home page (blog catalogue)
- `/blog/:blogId` - Individual blog post page

## 🤝 Contributing

This is a production-ready application. When extending:

1. Maintain the configuration-driven architecture
2. Add proper TypeScript types for new features
3. Follow the existing folder structure
4. Use shadcn/ui components where applicable
5. Write clean, maintainable code

## 📄 License

This project is private and proprietary.

## 📚 Documentation

Comprehensive documentation is available in the `documentation/` directory:

### Standards
- **[CODING_STANDARDS.md](./documentation/standards/CODING_STANDARDS.md)** - Coding standards and best practices

### Architecture
- **[SYSTEM_ARCHITECTURE.md](./documentation/architecture/SYSTEM_ARCHITECTURE.md)** - System architecture and design

### Guides
- **[COMPONENT_GUIDE.md](./documentation/guides/COMPONENT_GUIDE.md)** - Component development guide
- **[QUICK_REFERENCE.md](./documentation/guides/QUICK_REFERENCE.md)** - Quick reference guide

### Documentation Index
- **[README.md](./documentation/README.md)** - Complete documentation index

**All developers must read and follow the standards outlined in the documentation.**

## 🎉 Version

**Current Version: 1.0.0**

---

Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS

# System Architecture Documentation

This document describes the architecture and design decisions for the blog platform.

## 🏛️ System Architecture

### Configuration-Driven Architecture

The entire blog platform is built on a **configuration-driven architecture**. This means:

- **No hard-coded layouts** - All layouts come from JSON configuration
- **Dynamic block rendering** - Blocks are rendered based on type from configuration
- **Feature toggles** - Features are enabled/disabled via configuration
- **Type-safe** - All configurations are strongly typed

### Core Principles

1. **Separation of Concerns**
   - Presentation (components) separate from logic (hooks/utils)
   - Data fetching separate from rendering
   - Configuration separate from implementation

2. **Single Source of Truth**
   - Blog schema defines structure
   - TypeScript types enforce structure
   - Components render based on schema

3. **Extensibility**
   - Easy to add new block types
   - Easy to add new layout types
   - Easy to add new features

## 🧩 Component Architecture

### Block Rendering System

```
Blog JSON
  ↓
BlogRenderer
  ↓
BLOCK_MAP Registry
  ↓
Individual Block Components
  ↓
Rendered UI
```

**Key Components:**
- `BlogRenderer` - Main orchestrator
- `BLOCK_MAP` - Registry mapping block types to components
- Individual block components (HeadingBlock, ParagraphBlock, etc.)

### Layout Engine

The layout engine dynamically applies layouts based on configuration:

```typescript
layout.type === "single-column" → Full width content
layout.type === "two-column" → Content + Sidebar (TOC)
```

### Feature Toggle System

Features are conditionally rendered based on settings:

```typescript
settings.enableVoting → Render Voting component
settings.enableSocialShare → Render SocialShare component
layout.showTableOfContents → Render TOC sidebar
```

## 📊 Data Flow

### Blog Data Flow

```
Backend API / Mock Data
  ↓
getBlogPreviews() / getBlogById()
  ↓
HomePage / BlogPage
  ↓
BlogRenderer
  ↓
Block Components
```

### State Management

- **Local State**: Component-level state (`useState`)
- **Props**: Data passed down from parent components
- **No Global State**: Currently no need for context/redux

## 🔌 API Integration Points

### Current Implementation

- Mock data in `src/data/mockBlogs.ts`
- Functions: `getBlogPreviews()`, `getBlogById()`

### Future API Integration

Replace mock functions with API calls:

```typescript
// src/data/api.ts
export async function getBlogPreviews(): Promise<BlogPreview[]> {
  const response = await fetch('/api/blogs');
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
}
```

## 🎨 Styling Architecture

### Design System

- **Base**: Tailwind CSS with custom configuration
- **Components**: shadcn/ui components
- **Theming**: CSS variables for colors
- **Responsive**: Mobile-first approach

### Theme System

```css
:root {
  --background: ...;
  --foreground: ...;
  /* ... */
}

.dark {
  --background: ...;
  --foreground: ...;
  /* ... */
}
```

## 🔄 Routing Architecture

### Route Structure

```
/ → HomePage (Blog Catalogue)
/blog/:blogId → BlogPage (Single Blog View)
```

### Navigation

- React Router for client-side routing
- URL-based blog identification
- No page reloads

## 🛡️ Error Handling Strategy

### Error Boundaries

- Component-level error handling
- Graceful degradation
- User-friendly error messages

### Data Validation

- Type checking at compile time (TypeScript)
- Runtime validation for API responses
- Fallback UI for missing data

## 📈 Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Route-based code splitting
   - Lazy loading for heavy components

2. **Image Optimization**
   - Lazy loading images
   - Responsive image sizes
   - Proper alt text

3. **Bundle Size**
   - Tree shaking
   - Import only what's needed
   - Monitor bundle size

## 🔐 Security Architecture

### Client-Side Security

- No `innerHTML` usage
- XSS prevention through React's safe rendering
- Secure external links (`rel="noopener noreferrer"`)

### Data Validation

- Type-safe API responses
- Schema validation
- Input sanitization

## 🧪 Testing Strategy

### Testing Levels

1. **Unit Tests**: Individual components and functions
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Full user flows

### Testing Tools

- Jest for unit tests
- React Testing Library for component tests
- Playwright/Cypress for E2E tests

## 📦 Build & Deployment

### Build Process

```
TypeScript Compilation → Vite Build → Optimized Bundle
```

### Deployment

- Netlify configuration in `netlify.toml`
- SPA routing support
- Security headers
- Cache optimization

## 🔮 Future Enhancements

### Planned Features

1. **API Integration**
   - Replace mock data with real API
   - Add loading states
   - Add error boundaries

2. **Advanced Features**
   - Search functionality
   - Filtering and sorting
   - Pagination
   - Comments system

3. **Performance**
   - Image optimization
   - Service worker for offline support
   - Progressive Web App features

---

**Architecture Version:** 1.0.0


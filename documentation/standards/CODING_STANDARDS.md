# Coding Standards & Guidelines

This document outlines the standards and best practices for building and maintaining this blog platform project. All contributors must follow these guidelines to ensure code quality, maintainability, and scalability.

## 📁 Project Structure

### Directory Organization

```
src/
├── components/          # Reusable UI components
│   ├── blocks/         # Block rendering components (configuration-driven)
│   ├── blog/           # Blog-specific components
│   ├── ui/             # shadcn/ui base components
│   └── [feature]/      # Feature-specific components
├── pages/              # Page-level components (routes)
├── types/              # TypeScript type definitions
├── lib/                # Utility functions and helpers
├── data/               # Mock data and API functions
└── hooks/              # Custom React hooks (if needed)
```

### File Naming Conventions

#### Components
- **PascalCase** for component files: `BlogRenderer.tsx`, `EmptyBlogState.tsx`
- **PascalCase** for component names: `export function BlogRenderer()`
- One component per file
- File name must match component name exactly

#### Types
- **PascalCase** for type files: `blog.ts`, `user.ts`
- **PascalCase** for type names: `Blog`, `BlogPreview`, `BlogBlock`

#### Utilities
- **camelCase** for utility files: `utils.ts`, `formatDate.ts`
- **camelCase** for function names: `formatDate()`, `cn()`

#### Constants
- **UPPER_SNAKE_CASE** for constants: `APP_VERSION`, `MAX_BLOG_LENGTH`
- Constants file: `constants.ts` or `version.ts`

## 🧩 Component Standards

### Component Structure

Every component must follow this structure:

```typescript
/**
 * ComponentName Component
 * 
 * Brief description of what this component does.
 * Additional context if needed.
 */

import type { ComponentProps } from "@/types/...";
import { Dependency } from "@/components/...";
import { utility } from "@/lib/...";

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  
  return (
    // JSX
  );
}
```

### Component Placement Rules

1. **UI Components** (`src/components/ui/`)
   - Base shadcn/ui components
   - Generic, reusable components
   - No business logic

2. **Feature Components** (`src/components/[feature]/`)
   - Feature-specific components
   - Examples: `blog/`, `blocks/`, `auth/`
   - Can contain business logic

3. **Page Components** (`src/pages/`)
   - Route-level components
   - Full page layouts
   - Data fetching and state management

4. **Block Components** (`src/components/blocks/`)
   - Configuration-driven block renderers
   - Must be registered in `blocks/index.tsx`
   - Must use `block.id` as React key

### Component Best Practices

✅ **DO:**
- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components focused and single-purpose
- Use TypeScript for all props
- Add JSDoc comments for complex components
- Use `import type` for type-only imports
- Handle loading and error states
- Make components accessible (ARIA labels, semantic HTML)

❌ **DON'T:**
- Use class components
- Mix business logic with presentation
- Create components that are too large (>200 lines)
- Use `any` type
- Use array index as React key
- Use `innerHTML` or `dangerouslySetInnerHTML`
- Hard-code values that should be configurable

## 📝 TypeScript Standards

### Type Definitions

1. **Always use TypeScript types**
   ```typescript
   // ✅ Good
   interface BlogProps {
     blog: Blog;
     onVote?: (id: string) => void;
   }
   
   // ❌ Bad
   function BlogComponent(props: any) {}
   ```

2. **Use type-only imports for types**
   ```typescript
   // ✅ Good
   import type { Blog } from "@/types/blog";
   
   // ❌ Bad
   import { Blog } from "@/types/blog";
   ```

3. **Define types in `src/types/` directory**
   - One type file per domain: `blog.ts`, `user.ts`
   - Export all related types from the same file
   - Use descriptive names: `BlogBlock`, not `Block`

4. **Use union types for enums**
   ```typescript
   // ✅ Good
   type BlockType = "heading" | "paragraph" | "code";
   
   // ❌ Bad
   enum BlockType {
     Heading = "heading",
     Paragraph = "paragraph"
   }
   ```

### Type Safety Rules

- **Never use `any`** - Use `unknown` if type is truly unknown
- **Always type function parameters and return values**
- **Use `as const` for literal types**
- **Prefer interfaces over types for object shapes**
- **Use type guards for runtime type checking**

## 🎨 Styling Standards

### Tailwind CSS Guidelines

1. **Use Tailwind utility classes**
   ```tsx
   // ✅ Good
   <div className="flex items-center gap-4 p-6">
   
   // ❌ Bad
   <div style={{ display: 'flex', padding: '24px' }}>
   ```

2. **Use `cn()` utility for conditional classes**
   ```tsx
   // ✅ Good
   <div className={cn("base-class", condition && "conditional-class")}>
   
   // ❌ Bad
   <div className={`base-class ${condition ? "conditional-class" : ""}`}>
   ```

3. **Follow responsive design patterns**
   ```tsx
   // ✅ Good
   <div className="flex flex-col sm:flex-row gap-4">
   
   // ❌ Bad
   <div className="flex-row"> // No mobile consideration
   ```

4. **Use CSS variables for theming**
   - Colors: `bg-primary`, `text-foreground`
   - Spacing: Use Tailwind spacing scale
   - Never hard-code colors or spacing values

### Component Styling

- **Use shadcn/ui components** where possible
- **Maintain consistent spacing** (4px, 8px, 12px, 16px, 24px)
- **Use semantic HTML** with proper Tailwind classes
- **Follow mobile-first approach**

## 🏗️ Architecture Standards

### Configuration-Driven Rendering

1. **Block Rendering System**
   - All blocks must be registered in `src/components/blocks/index.tsx`
   - Use `BLOCK_MAP` registry pattern
   - Never hard-code block rendering logic
   - Always use `block.id` as React key (never array index)

2. **Layout Engine**
   - Layouts are configuration-driven
   - Support multiple layout types
   - Layout configuration comes from backend JSON

3. **Feature Toggles**
   - Use `settings.enableVoting`, `settings.enableSocialShare`
   - Conditional rendering based on configuration
   - Never hard-code feature availability

### Data Flow

1. **Props Down, Events Up**
   - Pass data down via props
   - Pass callbacks up via props
   - Avoid prop drilling (use context if needed)

2. **State Management**
   - Use React hooks (`useState`, `useEffect`)
   - Keep state as local as possible
   - Lift state only when necessary

3. **API Integration**
   - All API calls in `src/data/` directory
   - Use async/await for promises
   - Handle errors gracefully
   - Type all API responses

## 🔒 Security Standards

1. **Never use `innerHTML` or `dangerouslySetInnerHTML`**
   - Always use React's safe rendering
   - Sanitize any user input

2. **Validate all external data**
   - Type-check API responses
   - Validate JSON schemas
   - Handle malformed data gracefully

3. **Secure external links**
   ```tsx
   // ✅ Good
   <a href={url} target="_blank" rel="noopener noreferrer">
   
   // ❌ Bad
   <a href={url} target="_blank">
   ```

## ♿ Accessibility Standards

1. **Semantic HTML**
   - Use proper HTML elements (`<article>`, `<nav>`, `<header>`)
   - Use heading hierarchy correctly (h1 → h2 → h3)

2. **ARIA Labels**
   - Add `aria-label` for icon-only buttons
   - Use `role` attributes when needed
   - Ensure keyboard navigation works

3. **Color Contrast**
   - Maintain WCAG AA contrast ratios
   - Don't rely solely on color for information

## 📦 Import Organization

### Import Order

1. React and React-related imports
2. Third-party library imports
3. Internal type imports (`import type`)
4. Internal component imports
5. Internal utility imports
6. Relative imports

```typescript
// ✅ Good
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types/blog";
import { formatDate } from "@/lib/utils";
```

### Path Aliases

- Use `@/` prefix for all internal imports
- `@/components` - Components
- `@/types` - Type definitions
- `@/lib` - Utilities
- `@/pages` - Page components
- `@/data` - Data and API functions

## 🧪 Code Quality Standards

### Function Standards

1. **Keep functions small and focused**
   - Single responsibility principle
   - Maximum 50 lines per function
   - Extract complex logic into separate functions

2. **Use descriptive names**
   ```typescript
   // ✅ Good
   function formatBlogDate(dateString: string): string {}
   function extractHeadingsFromBlocks(blocks: BlogBlock[]): Heading[] {}
   
   // ❌ Bad
   function format(d: string): string {}
   function getData(arr: any[]): any[] {}
   ```

3. **Document complex functions**
   ```typescript
   /**
    * Extracts headings from blog blocks for table of contents.
    * 
    * @param blocks - Array of blog blocks to process
    * @returns Array of heading objects with id, level, and text
    */
   function extractHeadings(blocks: BlogBlock[]): Heading[] {}
   ```

### Error Handling

1. **Handle errors gracefully**
   ```typescript
   // ✅ Good
   try {
     const blog = await getBlogById(id);
     if (!blog) {
       return <NotFound />;
     }
     return <BlogPage blog={blog} />;
   } catch (error) {
     console.error("Failed to load blog:", error);
     return <ErrorState />;
   }
   ```

2. **Log errors appropriately**
   - Use `console.warn` for non-critical issues
   - Use `console.error` for actual errors
   - Never log sensitive information

### Performance Standards

1. **Optimize re-renders**
   - Use `React.memo` for expensive components
   - Use `useMemo` for expensive calculations
   - Use `useCallback` for stable function references

2. **Lazy loading**
   - Code-split routes with `React.lazy`
   - Lazy load images with `loading="lazy"`

3. **Bundle size**
   - Import only what you need
   - Use tree-shaking friendly imports
   - Monitor bundle size

## 📚 Documentation Standards

### Code Comments

1. **Component-level comments**
   ```typescript
   /**
    * BlogRenderer Component
    * 
    * Configuration-driven blog renderer that renders blocks in order.
    * Uses block.id as React key (never array index).
    */
   ```

2. **Function comments**
   ```typescript
   /**
    * Formats a date string to a human-readable format.
    * 
    * @param dateString - ISO date string
    * @returns Formatted date string (e.g., "January 15, 2024")
    */
   ```

3. **Complex logic comments**
   ```typescript
   // Calculate distance from mouse for repel effect
   const distance = Math.sqrt(dx * dx + dy * dy);
   ```

### README Updates

- Update README when adding major features
- Document breaking changes
- Keep installation instructions current

## 🔄 Git & Version Control Standards

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add floating dots animation to hero section`

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Refactoring
- `docs/documentation-update` - Documentation

## 🧹 Code Cleanup Rules

### Before Committing

1. **Remove unused imports**
2. **Remove console.log statements** (use console.warn/error if needed)
3. **Remove commented-out code**
4. **Fix all linting errors**
5. **Ensure TypeScript compiles without errors**
6. **Test the build** (`npm run build`)

### Code Review Checklist

- [ ] Follows naming conventions
- [ ] Uses TypeScript types correctly
- [ ] No hard-coded values
- [ ] Proper error handling
- [ ] Accessible (ARIA labels, semantic HTML)
- [ ] Responsive design
- [ ] No console errors
- [ ] Builds successfully
- [ ] Follows component structure standards

## 🎯 Project-Specific Standards

### Blog Schema Compliance

1. **Always match the exact schema structure**
   - Use types from `src/types/blog.ts`
   - Never modify types without updating schema
   - Validate data matches schema

2. **Block Rendering**
   - All blocks must be registered in `BLOCK_MAP`
   - Unknown block types must fail gracefully
   - Never skip block validation

3. **Layout Configuration**
   - Respect `layout.type` and `layout.maxWidth`
   - Honor `showTableOfContents` setting
   - Support all layout types

### Feature Toggle Compliance

- Check `settings.enableVoting` before rendering Voting
- Check `settings.enableSocialShare` before rendering SocialShare
- Check `layout.showTableOfContents` before rendering TOC
- Never hard-code feature availability

## 🚀 Deployment Standards

1. **Build must succeed** before deployment
2. **No TypeScript errors**
3. **No linting errors**
4. **Test in production build** (`npm run build && npm run preview`)
5. **Verify all routes work**
6. **Check responsive design on multiple devices**

## 📋 Checklist for New Components

When creating a new component, ensure:

- [ ] File name matches component name (PascalCase)
- [ ] Component is in the correct directory
- [ ] TypeScript types are defined
- [ ] Props interface is exported
- [ ] Component has JSDoc comment
- [ ] Uses Tailwind classes (no inline styles)
- [ ] Responsive design implemented
- [ ] Accessible (semantic HTML, ARIA if needed)
- [ ] Error handling implemented
- [ ] No hard-coded values
- [ ] Follows import organization
- [ ] Uses `cn()` for conditional classes
- [ ] No unused imports
- [ ] Builds without errors

## 🎓 Learning Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Remember:** Code is read more often than it's written. Write code that your future self (and teammates) will thank you for.

**Last Updated:** Version 1.0.0


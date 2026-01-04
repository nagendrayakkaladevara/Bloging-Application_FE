# Quick Reference Guide

A quick reference for common tasks and patterns in this project.

## 📁 File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `BlogRenderer.tsx` |
| Types | PascalCase | `blog.ts` |
| Utilities | camelCase | `utils.ts` |
| Constants | UPPER_SNAKE_CASE | `APP_VERSION` |

## 📍 Component Placement

| Component Type | Location | Example |
|----------------|----------|---------|
| UI Components | `src/components/ui/` | `button.tsx` |
| Feature Components | `src/components/[feature]/` | `blog/BlogRenderer.tsx` |
| Block Components | `src/components/blocks/` | `HeadingBlock.tsx` |
| Pages | `src/pages/` | `HomePage.tsx` |

## 🎨 Common Patterns

### Component Template

```typescript
/**
 * ComponentName Component
 * 
 * Description
 */

import type { ComponentProps } from "@/types/...";
import { Dependency } from "@/components/...";

interface ComponentNameProps {
  // Props
}

export function ComponentName({ prop }: ComponentNameProps) {
  return (
    // JSX
  );
}
```

### Conditional Classes

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  condition && "conditional-class"
)}>
```

### Type-Only Imports

```typescript
import type { Blog } from "@/types/blog";
```

### React Keys

```typescript
// ✅ Good - Use unique ID
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ Bad - Never use index
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

## 🔧 Common Utilities

### Format Date

```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
```

### Conditional Rendering

```typescript
// Feature toggle
{settings.enableVoting && <Voting voting={blog.voting} />}

// Optional content
{blog.meta.coverImage && (
  <img src={blog.meta.coverImage} alt={blog.meta.title} />
)}
```

## 🎯 Import Order

1. React imports
2. Third-party libraries
3. Type imports (`import type`)
4. Component imports
5. Utility imports

```typescript
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
```

## 📝 TypeScript Patterns

### Props Interface

```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  callback?: () => void;
}
```

### Union Types

```typescript
type Status = "pending" | "loading" | "success" | "error";
```

### Type Guards

```typescript
function isHeadingBlock(block: BlogBlock): block is HeadingBlock {
  return block.type === "heading";
}
```

## 🎨 Tailwind Patterns

### Responsive Design

```typescript
// Mobile first
<div className="flex flex-col sm:flex-row lg:gap-8">
```

### Spacing

```typescript
// Between elements
<div className="space-y-4">  // Vertical
<div className="space-x-4">  // Horizontal
<div className="gap-4">       // Flex/Grid gap
```

### Colors

```typescript
// Use theme variables
<div className="bg-primary text-primary-foreground">
<div className="bg-muted text-muted-foreground">
```

## 🚫 Common Mistakes to Avoid

1. ❌ Using `any` type
2. ❌ Using array index as React key
3. ❌ Hard-coding values
4. ❌ Using `innerHTML`
5. ❌ Missing error handling
6. ❌ No responsive design
7. ❌ Missing accessibility features
8. ❌ Unused imports
9. ❌ Console.log in production
10. ❌ Commented-out code

## ✅ Code Quality Checklist

- [ ] TypeScript types defined
- [ ] No `any` types
- [ ] Proper error handling
- [ ] Responsive design
- [ ] Accessibility (ARIA, semantic HTML)
- [ ] No hard-coded values
- [ ] Uses `cn()` for conditional classes
- [ ] Proper import organization
- [ ] Component documentation
- [ ] Builds without errors

---

**Quick Reference Version:** 1.0.0


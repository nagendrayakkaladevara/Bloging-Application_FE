# Component Development Guide

This guide provides detailed instructions for creating and maintaining components in this project.

## 📦 Creating a New Component

### Step-by-Step Process

1. **Determine Component Location**
   - Is it a UI component? → `src/components/ui/`
   - Is it feature-specific? → `src/components/[feature]/`
   - Is it a page? → `src/pages/`

2. **Create Component File**
   - Use PascalCase: `MyComponent.tsx`
   - File name must match component name

3. **Write Component Structure**
   ```typescript
   /**
    * MyComponent Component
    * 
    * Brief description of component purpose.
    */

   import type { MyComponentProps } from "@/types/...";
   import { Dependency } from "@/components/...";

   interface MyComponentProps {
     // Props definition
   }

   export function MyComponent({ prop1, prop2 }: MyComponentProps) {
     // Component logic
     
     return (
       // JSX
     );
   }
   ```

4. **Add TypeScript Types**
   - Define props interface
   - Use types from `@/types/` when possible
   - Never use `any`

5. **Implement Component**
   - Follow React best practices
   - Use hooks appropriately
   - Keep component focused

6. **Style Component**
   - Use Tailwind utility classes
   - Use `cn()` for conditional classes
   - Ensure responsive design

7. **Test Component**
   - Verify it renders correctly
   - Test responsive behavior
   - Check accessibility

## 🧩 Component Types

### UI Components (`src/components/ui/`)

**Purpose:** Base, reusable components (shadcn/ui)

**Characteristics:**
- Generic and reusable
- No business logic
- Highly configurable via props
- Examples: Button, Card, Badge

**Example:**
```typescript
// src/components/ui/button.tsx
export interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  // ...
}
```

### Feature Components (`src/components/[feature]/`)

**Purpose:** Feature-specific components

**Characteristics:**
- Contains business logic
- Feature-specific functionality
- Examples: BlogRenderer, Voting, SocialShare

**Example:**
```typescript
// src/components/blog/BlogRenderer.tsx
export function BlogRenderer({ blog }: BlogRendererProps) {
  // Blog-specific rendering logic
}
```

### Block Components (`src/components/blocks/`)

**Purpose:** Configuration-driven block renderers

**Characteristics:**
- Must accept `block` prop
- Must be registered in `BLOCK_MAP`
- Must use `block.id` as key
- Examples: HeadingBlock, ParagraphBlock

**Example:**
```typescript
// src/components/blocks/HeadingBlock.tsx
export function HeadingBlock({ block }: HeadingBlockProps) {
  // Block-specific rendering
}

// Must register in src/components/blocks/index.tsx
export const BLOCK_MAP = {
  heading: HeadingBlock,
  // ...
};
```

### Page Components (`src/pages/`)

**Purpose:** Route-level components

**Characteristics:**
- Full page layouts
- Data fetching
- Route handling
- Examples: HomePage, BlogPage

**Example:**
```typescript
// src/pages/HomePage.tsx
export function HomePage({ blogs }: HomePageProps) {
  // Page-level logic and layout
}
```

## 🎨 Styling Components

### Using Tailwind Classes

```tsx
// ✅ Good - Responsive and semantic
<div className="flex flex-col sm:flex-row gap-4 p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
</div>

// ❌ Bad - No responsive design
<div className="flex-row p-6">
  <h2 className="text-2xl">Title</h2>
</div>
```

### Conditional Classes

```tsx
// ✅ Good - Use cn() utility
<div className={cn(
  "base-class",
  condition && "conditional-class",
  variant === "primary" && "primary-class"
)}>

// ❌ Bad - String concatenation
<div className={`base-class ${condition ? "conditional-class" : ""}`}>
```

### Responsive Design

Always follow mobile-first approach:

```tsx
// ✅ Good - Mobile first
<div className="flex flex-col sm:flex-row lg:gap-8">

// ❌ Bad - Desktop first
<div className="flex-row sm:flex-col">
```

## 🔗 Component Composition

### Composing Components

```tsx
// ✅ Good - Composed from smaller components
export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BlogMetadata blog={blog} />
      </CardContent>
    </Card>
  );
}

// ❌ Bad - Everything in one component
export function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="card">
      <div className="header">
        <h3>{blog.title}</h3>
      </div>
      {/* ... */}
    </div>
  );
}
```

## 🎯 Props Design

### Props Best Practices

1. **Keep props minimal**
   ```tsx
   // ✅ Good - Focused props
   interface ButtonProps {
     children: React.ReactNode;
     onClick?: () => void;
     variant?: "default" | "outline";
   }
   
   // ❌ Bad - Too many props
   interface ButtonProps {
     children: React.ReactNode;
     onClick?: () => void;
     onHover?: () => void;
     onFocus?: () => void;
     variant?: string;
     size?: string;
     color?: string;
     // ... 20 more props
   }
   ```

2. **Use default props**
   ```tsx
   // ✅ Good
   export function Button({ 
     variant = "default",
     size = "md",
     ...props 
   }: ButtonProps) {}
   ```

3. **Destructure props**
   ```tsx
   // ✅ Good
   export function Component({ prop1, prop2 }: ComponentProps) {}
   
   // ❌ Bad
   export function Component(props: ComponentProps) {
     return <div>{props.prop1}</div>;
   }
   ```

## ♿ Accessibility in Components

### Semantic HTML

```tsx
// ✅ Good - Semantic HTML
<article>
  <header>
    <h2>Blog Title</h2>
  </header>
  <main>
    <p>Content</p>
  </main>
</article>

// ❌ Bad - Div soup
<div>
  <div>
    <div>Blog Title</div>
  </div>
  <div>
    <div>Content</div>
  </div>
</div>
```

### ARIA Labels

```tsx
// ✅ Good - Accessible button
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// ❌ Bad - No label
<button>
  <X className="h-4 w-4" />
</button>
```

## 🧪 Testing Components

### Component Testing Checklist

- [ ] Component renders without errors
- [ ] Props are handled correctly
- [ ] Conditional rendering works
- [ ] Event handlers fire correctly
- [ ] Responsive design works
- [ ] Accessibility features work
- [ ] Error states are handled

## 📝 Documentation Requirements

### Component Documentation

Every component must have:

1. **JSDoc comment** describing purpose
2. **Props interface** with TypeScript types
3. **Usage examples** in complex cases
4. **Notes** for non-obvious behavior

```typescript
/**
 * BlogCard Component
 * 
 * Displays a blog preview card with title, metadata, and optional image.
 * 
 * @example
 * <BlogCard 
 *   blog={blogData}
 *   onClick={() => navigate(`/blog/${blogData.id}`)}
 * />
 */

interface BlogCardProps {
  blog: BlogPreview;
  onClick?: () => void;
}
```

## 🔄 Component Lifecycle

### When to Refactor

Refactor a component when:
- It exceeds 200 lines
- It has too many responsibilities
- It's hard to test
- It's hard to understand
- It's reused in multiple places (extract)

### When to Split

Split a component when:
- It has multiple distinct sections
- Sections can be reused elsewhere
- It improves readability
- It makes testing easier

---

**Component Guide Version:** 1.0.0


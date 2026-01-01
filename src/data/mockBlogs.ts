/**
 * Mock Blog Data
 * 
 * Sample blog data for development and testing.
 * In production, this would be fetched from an API.
 */

import type { Blog, BlogPreview } from "@/types/blog";

export const mockBlogs: Blog[] = [
  {
    meta: {
      title: "Getting Started with React and TypeScript",
      description: "A comprehensive guide to building modern web applications with React and TypeScript.",
      author: "John Doe",
      publishedAt: "2024-01-15T10:00:00Z",
      readTime: 8,
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    },
    layout: {
      type: "two-column",
      maxWidth: "1200px",
      showTableOfContents: true,
    },
    settings: {
      enableVoting: true,
      enableSocialShare: true,
    },
    tags: ["React", "TypeScript", "Frontend", "Tutorial"],
    links: [
      {
        label: "Official React Docs",
        url: "https://react.dev",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "Introduction",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "React is a powerful JavaScript library for building user interfaces. When combined with TypeScript, you get type safety and better developer experience.",
      },
      {
        id: "block-3",
        type: "heading",
        level: 2,
        text: "Why TypeScript?",
      },
      {
        id: "block-4",
        type: "paragraph",
        text: "TypeScript adds static type checking to JavaScript, helping you catch errors early and write more maintainable code.",
      },
      {
        id: "block-5",
        type: "callout",
        variant: "info",
        title: "Pro Tip",
        content: "Always enable strict mode in TypeScript for the best type safety.",
      },
      {
        id: "block-6",
        type: "heading",
        level: 3,
        text: "Setting Up Your Project",
      },
      {
        id: "block-7",
        type: "paragraph",
        text: "To get started, you can use Vite to create a new React + TypeScript project:",
      },
      {
        id: "block-8",
        type: "code",
        code: "npm create vite@latest my-app -- --template react-ts",
        language: "bash",
      },
      {
        id: "block-9",
        type: "heading",
        level: 3,
        text: "Key Concepts",
      },
      {
        id: "block-10",
        type: "list",
        style: "unordered",
        items: [
          "Components are the building blocks of React applications",
          "Props allow you to pass data to components",
          "State manages component data that can change",
          "Hooks let you use state and other React features",
        ],
      },
      {
        id: "block-11",
        type: "divider",
      },
      {
        id: "block-12",
        type: "quote",
        text: "The best way to learn React is by building projects.",
        author: "React Community",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 42,
      downvotes: 2,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "facebook", "linkedin", "copy"],
    },
  },
  {
    meta: {
      title: "Mastering Tailwind CSS",
      description: "Learn how to build beautiful, responsive UIs with Tailwind CSS utility classes.",
      author: "Jane Smith",
      publishedAt: "2024-01-20T14:30:00Z",
      readTime: 12,
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    },
    layout: {
      type: "single-column",
      maxWidth: "800px",
      showTableOfContents: false,
    },
    settings: {
      enableVoting: true,
      enableSocialShare: true,
    },
    tags: ["CSS", "Tailwind", "Design", "Frontend"],
    links: [],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "What is Tailwind CSS?",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "Tailwind CSS is a utility-first CSS framework that allows you to rapidly build custom user interfaces.",
      },
      {
        id: "block-3",
        type: "image",
        src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop",
        alt: "Code editor with Tailwind CSS",
        caption: "Building with Tailwind CSS",
      },
      {
        id: "block-4",
        type: "heading",
        level: 2,
        text: "Benefits",
      },
      {
        id: "block-5",
        type: "list",
        style: "ordered",
        items: [
          "Rapid development with utility classes",
          "No need to write custom CSS",
          "Consistent design system",
          "Small bundle size with purging",
        ],
      },
      {
        id: "block-6",
        type: "callout",
        variant: "success",
        title: "Remember",
        content: "Tailwind uses a mobile-first approach to responsive design.",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 28,
      downvotes: 1,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "linkedin", "copy"],
    },
  },
  {
    meta: {
      title: "Building Configuration-Driven UIs",
      description: "Learn how to create flexible, data-driven user interfaces that adapt to different content structures.",
      author: "Alex Johnson",
      publishedAt: "2024-01-25T09:15:00Z",
      readTime: 15,
    },
    layout: {
      type: "two-column",
      maxWidth: "1400px",
      showTableOfContents: true,
    },
    settings: {
      enableVoting: false,
      enableSocialShare: true,
    },
    tags: ["Architecture", "React", "Best Practices"],
    links: [
      {
        label: "GitHub Repository",
        url: "https://github.com/example",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "What is Configuration-Driven UI?",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "Configuration-driven UI is an architectural pattern where the user interface is generated dynamically based on configuration data, typically JSON schemas.",
      },
      {
        id: "block-3",
        type: "heading",
        level: 2,
        text: "Advantages",
      },
      {
        id: "block-4",
        type: "list",
        style: "unordered",
        items: [
          "Flexibility: Change UI without code changes",
          "Scalability: Easy to add new content types",
          "Maintainability: Centralized rendering logic",
          "Consistency: Uniform rendering across content",
        ],
      },
      {
        id: "block-5",
        type: "heading",
        level: 3,
        text: "Implementation Strategy",
      },
      {
        id: "block-6",
        type: "paragraph",
        text: "The key is to create a component registry that maps content types to React components:",
      },
      {
        id: "block-7",
        type: "code",
        code: `const BLOCK_MAP = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  // ... more blocks
};`,
        language: "typescript",
        filename: "blockRegistry.ts",
      },
      {
        id: "block-8",
        type: "callout",
        variant: "warning",
        title: "Important",
        content: "Always validate your configuration data and handle unknown types gracefully.",
      },
      {
        id: "block-9",
        type: "divider",
      },
      {
        id: "block-10",
        type: "quote",
        text: "The best architecture is the one that allows you to change your mind.",
        author: "Rich Hickey",
      },
    ],
    voting: {
      enabled: false,
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "linkedin", "reddit", "copy"],
    },
  },
];

/**
 * Get a blog by ID
 */
export function getBlogById(id: string): Blog | undefined {
  return mockBlogs.find((blog) => {
    // Generate a simple ID from the title for demo purposes
    const blogId = blog.meta.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return blogId === id;
  });
}

/**
 * Get all blog previews for the home page
 */
export function getBlogPreviews(): BlogPreview[] {
  return mockBlogs.map((blog) => {
    const id = blog.meta.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      id,
      meta: blog.meta,
      tags: blog.tags,
    };
  });
}


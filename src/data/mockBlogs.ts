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
  {
    meta: {
      title: "Understanding Modern JavaScript: ES6+ Features",
      description: "A deep dive into the modern JavaScript features that have revolutionized web development.",
      author: "Sarah Williams",
      publishedAt: "2024-02-01T11:00:00Z",
      readTime: 10,
      coverImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop",
    },
    layout: {
      type: "single-column",
      maxWidth: "900px",
      showTableOfContents: true,
    },
    settings: {
      enableVoting: true,
      enableSocialShare: true,
    },
    tags: ["JavaScript", "ES6", "Web Development", "Programming"],
    links: [
      {
        label: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "Introduction to ES6+",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "ECMAScript 6 (ES6) and subsequent versions introduced powerful features that have become essential for modern JavaScript development. Let's explore the most impactful ones.",
      },
      {
        id: "block-3",
        type: "heading",
        level: 3,
        text: "Arrow Functions",
      },
      {
        id: "block-4",
        type: "paragraph",
        text: "Arrow functions provide a more concise syntax for writing functions and automatically bind the 'this' context.",
      },
      {
        id: "block-5",
        type: "code",
        code: `// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;`,
        language: "javascript",
      },
      {
        id: "block-6",
        type: "heading",
        level: 3,
        text: "Destructuring",
      },
      {
        id: "block-7",
        type: "paragraph",
        text: "Destructuring allows you to extract values from arrays or objects into distinct variables.",
      },
      {
        id: "block-8",
        type: "code",
        code: `const person = { name: "John", age: 30 };
const { name, age } = person;
console.log(name); // "John"`,
        language: "javascript",
      },
      {
        id: "block-9",
        type: "callout",
        variant: "info",
        title: "Tip",
        content: "Destructuring works great with function parameters and React props!",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 35,
      downvotes: 1,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "facebook", "linkedin", "copy"],
    },
  },
  {
    meta: {
      title: "The Complete Guide to CSS Grid Layout",
      description: "Master CSS Grid and create complex, responsive layouts with ease.",
      author: "Michael Chen",
      publishedAt: "2024-02-08T15:20:00Z",
      readTime: 14,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
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
    tags: ["CSS", "Grid", "Layout", "Web Design"],
    links: [
      {
        label: "CSS Grid Guide",
        url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "What is CSS Grid?",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "CSS Grid is a powerful layout system that allows you to create two-dimensional layouts with rows and columns. It's perfect for complex page structures.",
      },
      {
        id: "block-3",
        type: "heading",
        level: 3,
        text: "Basic Grid Setup",
      },
      {
        id: "block-4",
        type: "code",
        code: `.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}`,
        language: "css",
      },
      {
        id: "block-5",
        type: "heading",
        level: 3,
        text: "Grid Areas",
      },
      {
        id: "block-6",
        type: "paragraph",
        text: "Named grid areas make it easy to create semantic layouts:",
      },
      {
        id: "block-7",
        type: "code",
        code: `.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}`,
        language: "css",
      },
      {
        id: "block-8",
        type: "callout",
        variant: "success",
        title: "Pro Tip",
        content: "Use grid-template-areas for visual layout planning - it's like drawing your layout!",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 52,
      downvotes: 3,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "linkedin", "copy"],
    },
  },
  {
    meta: {
      title: "Building RESTful APIs with Node.js and Express",
      description: "Learn how to create robust, scalable REST APIs using Node.js and Express framework.",
      author: "David Rodriguez",
      publishedAt: "2024-02-15T09:45:00Z",
      readTime: 18,
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
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
    tags: ["Node.js", "Express", "API", "Backend", "REST"],
    links: [
      {
        label: "Express.js Documentation",
        url: "https://expressjs.com/",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "Getting Started",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.",
      },
      {
        id: "block-3",
        type: "heading",
        level: 3,
        text: "Setting Up Express",
      },
      {
        id: "block-4",
        type: "code",
        code: `npm init -y
npm install express
npm install -D nodemon`,
        language: "bash",
      },
      {
        id: "block-5",
        type: "heading",
        level: 3,
        text: "Basic Server",
      },
      {
        id: "block-6",
        type: "code",
        code: `const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
        language: "javascript",
      },
      {
        id: "block-7",
        type: "heading",
        level: 3,
        text: "REST Principles",
      },
      {
        id: "block-8",
        type: "list",
        style: "unordered",
        items: [
          "Use HTTP methods correctly (GET, POST, PUT, DELETE)",
          "Use meaningful resource URLs",
          "Return appropriate HTTP status codes",
          "Handle errors gracefully",
          "Version your API",
        ],
      },
      {
        id: "block-9",
        type: "callout",
        variant: "warning",
        title: "Security",
        content: "Always validate and sanitize user input. Use middleware like helmet and express-validator.",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 41,
      downvotes: 2,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "linkedin", "reddit", "copy"],
    },
  },
  {
    meta: {
      title: "Introduction to Docker and Containerization",
      description: "Learn how Docker simplifies application deployment and development workflows.",
      author: "Emily Zhang",
      publishedAt: "2024-02-22T13:10:00Z",
      readTime: 12,
      coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop",
    },
    layout: {
      type: "two-column",
      maxWidth: "1300px",
      showTableOfContents: true,
    },
    settings: {
      enableVoting: true,
      enableSocialShare: true,
    },
    tags: ["Docker", "DevOps", "Containers", "Deployment"],
    links: [
      {
        label: "Docker Official Docs",
        url: "https://docs.docker.com/",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "What is Docker?",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "Docker is a platform that uses containerization to package applications with all their dependencies, ensuring they run consistently across different environments.",
      },
      {
        id: "block-3",
        type: "image",
        src: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop",
        alt: "Docker containers",
        caption: "Containerized applications",
      },
      {
        id: "block-4",
        type: "heading",
        level: 3,
        text: "Key Benefits",
      },
      {
        id: "block-5",
        type: "list",
        style: "ordered",
        items: [
          "Consistency across development, staging, and production",
          "Isolation of applications and dependencies",
          "Easy scaling and deployment",
          "Resource efficiency compared to virtual machines",
        ],
      },
      {
        id: "block-6",
        type: "heading",
        level: 3,
        text: "Dockerfile Example",
      },
      {
        id: "block-7",
        type: "code",
        code: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
        language: "dockerfile",
      },
      {
        id: "block-8",
        type: "callout",
        variant: "info",
        title: "Best Practice",
        content: "Use multi-stage builds to reduce image size and improve security.",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 38,
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
      title: "Getting Started with Git and Version Control",
      description: "Master the fundamentals of Git and learn essential version control workflows for modern development.",
      author: "Robert Kim",
      publishedAt: "2024-02-28T16:30:00Z",
      readTime: 9,
    },
    layout: {
      type: "single-column",
      maxWidth: "850px",
      showTableOfContents: true,
    },
    settings: {
      enableVoting: true,
      enableSocialShare: true,
    },
    tags: ["Git", "Version Control", "Development", "Tools"],
    links: [
      {
        label: "Git Documentation",
        url: "https://git-scm.com/doc",
        type: "external",
      },
      {
        label: "GitHub Guides",
        url: "https://guides.github.com/",
        type: "external",
      },
    ],
    blocks: [
      {
        id: "block-1",
        type: "heading",
        level: 2,
        text: "Why Version Control?",
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "Version control systems like Git help you track changes to your code, collaborate with others, and maintain a history of your project.",
      },
      {
        id: "block-3",
        type: "heading",
        level: 3,
        text: "Essential Git Commands",
      },
      {
        id: "block-4",
        type: "code",
        code: `# Initialize a repository
git init

# Stage changes
git add .

# Commit changes
git commit -m "Your commit message"

# Check status
git status

# View history
git log`,
        language: "bash",
      },
      {
        id: "block-5",
        type: "heading",
        level: 3,
        text: "Branching Strategy",
      },
      {
        id: "block-6",
        type: "paragraph",
        text: "Branches allow you to work on features independently without affecting the main codebase:",
      },
      {
        id: "block-7",
        type: "code",
        code: `# Create and switch to a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branches
git merge feature/new-feature`,
        language: "bash",
      },
      {
        id: "block-8",
        type: "divider",
      },
      {
        id: "block-9",
        type: "quote",
        text: "Git is a distributed version control system that tracks changes in any set of computer files.",
        author: "Git Documentation",
      },
      {
        id: "block-10",
        type: "callout",
        variant: "success",
        title: "Remember",
        content: "Always write clear, descriptive commit messages. They help you and your team understand the project history.",
      },
    ],
    voting: {
      enabled: true,
      upvotes: 29,
      downvotes: 0,
      userVote: null,
    },
    socialShare: {
      enabled: true,
      platforms: ["twitter", "facebook", "linkedin", "reddit", "copy"],
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

/**
 * Get blog previews by IDs
 */
export function getBlogPreviewsByIds(ids: string[]): BlogPreview[] {
  const allPreviews = getBlogPreviews();
  return allPreviews.filter((preview) => ids.includes(preview.id));
}


/**
 * BlogRenderer Component
 * 
 * Configuration-driven blog renderer that renders blocks in order.
 * Uses block.id as React key (never array index).
 */

import type { Blog } from "@/types/blog";
import { renderBlock } from "@/components/blocks";

interface BlogRendererProps {
  blog: Blog;
}

export function BlogRenderer({ blog }: BlogRendererProps) {
  // Determine layout class based on layout type
  // Note: TOC is now in the main sidebar, so we don't need two-column layout here
  const layoutClass = "max-w-none";

  return (
    <div
      className={layoutClass}
      style={{ maxWidth: blog.layout.maxWidth }}
    >
      {/* Main Content */}
      <article>
        {/* Render all blocks in order - using block.id as key (never array index) */}
        {blog.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </article>
    </div>
  );
}


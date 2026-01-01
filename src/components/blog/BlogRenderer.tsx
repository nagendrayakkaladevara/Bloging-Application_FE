/**
 * BlogRenderer Component
 * 
 * Configuration-driven blog renderer that renders blocks in order.
 * Uses block.id as React key (never array index).
 */

import type { Blog } from "@/types/blog";
import { renderBlock } from "@/components/blocks";
import { TableOfContents } from "./TableOfContents";

interface BlogRendererProps {
  blog: Blog;
}

/**
 * Extracts headings from blocks for Table of Contents
 */
function extractHeadings(blocks: Blog["blocks"]) {
  return blocks
    .filter((block) => block.type === "heading")
    .map((block) => {
      if (block.type === "heading") {
        return {
          id: block.id,
          level: block.level,
          text: block.text,
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ id: string; level: number; text: string }>;
}

export function BlogRenderer({ blog }: BlogRendererProps) {
  const headings = extractHeadings(blog.blocks);
  const showTOC = blog.layout.showTableOfContents && headings.length > 0;

  // Determine layout class based on layout type
  const layoutClass =
    blog.layout.type === "two-column"
      ? "grid grid-cols-1 lg:grid-cols-3 gap-8"
      : "max-w-none";

  const contentClass =
    blog.layout.type === "two-column" ? "lg:col-span-2" : "";

  return (
    <div
      className={layoutClass}
      style={{ maxWidth: blog.layout.maxWidth }}
    >
      {/* Main Content */}
      <article className={contentClass}>
        {/* Render all blocks in order - using block.id as key (never array index) */}
        {blog.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </article>

      {/* Table of Contents Sidebar */}
      {showTOC && blog.layout.type === "two-column" && (
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}
    </div>
  );
}


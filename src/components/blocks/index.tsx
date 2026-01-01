/**
 * Block Components Registry
 * 
 * Central registry for all block components.
 * Maps block types to their corresponding React components.
 * 
 * Note: This file must be .tsx (not .ts) because it contains JSX.
 */

import type { BlogBlock } from "@/types/blog";
import { HeadingBlock } from "./HeadingBlock";
import { ParagraphBlock } from "./ParagraphBlock";
import { CodeBlock } from "./CodeBlock";
import { ImageBlock } from "./ImageBlock";
import { CalloutBlock } from "./CalloutBlock";
import { ListBlock } from "./ListBlock";
import { QuoteBlock } from "./QuoteBlock";
import { DividerBlock } from "./DividerBlock";

/**
 * BLOCK_MAP: Maps block types to their React components
 * 
 * This is the core of the configuration-driven rendering system.
 * When a new block type is added, it must be registered here.
 */
const BLOCK_MAP = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  image: ImageBlock,
  callout: CalloutBlock,
  list: ListBlock,
  quote: QuoteBlock,
  divider: DividerBlock,
} as const;

/**
 * Renders a single block based on its type
 * 
 * @param block - The block to render
 * @returns The rendered block component or null if type is unknown
 */
export function renderBlock(block: BlogBlock): React.ReactElement | null {
  const BlockComponent = BLOCK_MAP[block.type];

  if (!BlockComponent) {
    console.warn(`Unknown block type: ${block.type}`, block);
    return null;
  }

  // Type assertion is safe here because we've already checked the type
  return <BlockComponent block={block as never} />;
}


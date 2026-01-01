import type { ParagraphBlock as ParagraphBlockType } from "@/types/blog"
import { cn } from "@/lib/utils"

interface ParagraphBlockProps {
  block: ParagraphBlockType;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <p className={cn("text-base leading-7 mb-4 text-foreground")}>
      {block.text}
    </p>
  );
}


import type { QuoteBlock as QuoteBlockType } from "@/types/blog"
import { cn } from "@/lib/utils"

interface QuoteBlockProps {
  block: QuoteBlockType;
}

export function QuoteBlock({ block }: QuoteBlockProps) {
  return (
    <blockquote className={cn(
      "my-6 border-l-4 border-primary pl-4 italic",
      "text-lg text-muted-foreground"
    )}>
      <p className="mb-2">{block.text}</p>
      {block.author && (
        <footer className="text-sm text-muted-foreground">
          — {block.author}
        </footer>
      )}
    </blockquote>
  );
}


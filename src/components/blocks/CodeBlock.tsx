import type { CodeBlock as CodeBlockType } from "@/types/blog"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface CodeBlockProps {
  block: CodeBlockType;
}

export function CodeBlock({ block }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border bg-muted relative group">
      {(block.filename || block.language) && (
        <div className="px-4 py-2 bg-muted border-b text-sm font-mono text-muted-foreground flex items-center justify-between">
          <span>{block.filename || block.language}</span>
          <button
            onClick={handleCopy}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCopy();
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors flex-shrink-0 touch-manipulation z-10 relative pointer-events-auto"
            aria-label="Copy code"
            type="button"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm font-mono">{block.code}</code>
        </pre>
        {!(block.filename || block.language) && (
          <button
            onClick={handleCopy}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCopy();
            }}
            className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors flex-shrink-0 touch-manipulation z-10 opacity-0 group-hover:opacity-100"
            aria-label="Copy code"
            type="button"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}


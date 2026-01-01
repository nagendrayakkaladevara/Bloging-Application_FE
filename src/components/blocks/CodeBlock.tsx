import type { CodeBlock as CodeBlockType } from "@/types/blog"

interface CodeBlockProps {
  block: CodeBlockType;
}

export function CodeBlock({ block }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border bg-muted">
      {(block.filename || block.language) && (
        <div className="px-4 py-2 bg-muted border-b text-sm font-mono text-muted-foreground">
          {block.filename || block.language}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono">{block.code}</code>
      </pre>
    </div>
  );
}


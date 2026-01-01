import type { ImageBlock as ImageBlockType } from "@/types/blog"
import { cn } from "@/lib/utils"

interface ImageBlockProps {
  block: ImageBlockType;
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <figure className="my-6">
      <img
        src={block.src}
        alt={block.alt}
        className={cn(
          "w-full rounded-lg border",
          "object-cover"
        )}
      />
      {block.caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}


import type { HeadingBlock as HeadingBlockType } from "@/types/blog"
import { cn } from "@/lib/utils"

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const headingClasses = {
    1: "text-4xl font-bold mt-8 mb-4",
    2: "text-3xl font-bold mt-6 mb-3",
    3: "text-2xl font-semibold mt-5 mb-2",
    4: "text-xl font-semibold mt-4 mb-2",
    5: "text-lg font-semibold mt-3 mb-2",
    6: "text-base font-semibold mt-3 mb-2",
  };

  const className = cn(headingClasses[block.level], "scroll-mt-20");
  const id = `heading-${block.id}`;

  switch (block.level) {
    case 1:
      return <h1 id={id} className={className}>{block.text}</h1>;
    case 2:
      return <h2 id={id} className={className}>{block.text}</h2>;
    case 3:
      return <h3 id={id} className={className}>{block.text}</h3>;
    case 4:
      return <h4 id={id} className={className}>{block.text}</h4>;
    case 5:
      return <h5 id={id} className={className}>{block.text}</h5>;
    case 6:
      return <h6 id={id} className={className}>{block.text}</h6>;
  }
}


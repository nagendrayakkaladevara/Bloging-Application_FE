import type { ListBlock as ListBlockType } from "@/types/blog"

interface ListBlockProps {
  block: ListBlockType;
}

export function ListBlock({ block }: ListBlockProps) {
  if (block.style === "ordered") {
    return (
      <ol className="my-4 ml-6 list-decimal space-y-2">
        {block.items.map((item, index) => (
          <li key={index} className="text-base leading-7">
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="my-4 ml-6 list-disc space-y-2">
      {block.items.map((item, index) => (
        <li key={index} className="text-base leading-7">
          {item}
        </li>
      ))}
    </ul>
  );
}


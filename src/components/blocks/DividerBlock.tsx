import type { DividerBlock as DividerBlockType } from "@/types/blog"
import { Separator } from "@/components/ui/separator"

interface DividerBlockProps {
  block: DividerBlockType;
}

export function DividerBlock({ block }: DividerBlockProps) {
  // Block is kept for future use
  void block;
  return <Separator className="my-8" />;
}


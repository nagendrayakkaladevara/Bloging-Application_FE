import type { DividerBlock as DividerBlockType } from "@/types/blog"
import { Separator } from "@/components/ui/separator"

interface DividerBlockProps {
  block: DividerBlockType;
}

export function DividerBlock({ block: _block }: DividerBlockProps) {
  return <Separator className="my-8" />;
}


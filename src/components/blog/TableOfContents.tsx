/**
 * TableOfContents Component
 * 
 * Renders a navigation menu for blog headings.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(`heading-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#heading-${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors block",
                heading.level === 1 && "font-medium",
                heading.level === 2 && "ml-2",
                heading.level === 3 && "ml-4",
                heading.level === 4 && "ml-6",
                heading.level === 5 && "ml-8",
                heading.level === 6 && "ml-10"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}


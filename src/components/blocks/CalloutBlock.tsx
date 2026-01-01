import type { CalloutBlock as CalloutBlockType } from "@/types/blog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info, AlertTriangle, CheckCircle2 } from "lucide-react"

interface CalloutBlockProps {
  block: CalloutBlockType;
}

const calloutConfig = {
  info: {
    icon: Info,
    variant: "default" as const,
  },
  warning: {
    icon: AlertTriangle,
    variant: "default" as const,
  },
  error: {
    icon: AlertCircle,
    variant: "destructive" as const,
  },
  success: {
    icon: CheckCircle2,
    variant: "default" as const,
  },
};

export function CalloutBlock({ block }: CalloutBlockProps) {
  const config = calloutConfig[block.variant];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="my-6">
      <Icon className="h-4 w-4" />
      {block.title ? (
        <AlertTitle>{block.title}</AlertTitle>
      ) : null}
      <AlertDescription>{block.content}</AlertDescription>
    </Alert>
  );
}


import type { CalloutBlock as CalloutBlockType } from "@/types/blog"
import { AlertCircle, Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CalloutBlockProps {
  block: CalloutBlockType;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-900 dark:text-blue-100",
    titleColor: "text-blue-800 dark:text-blue-200",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    textColor: "text-yellow-900 dark:text-yellow-100",
    titleColor: "text-yellow-800 dark:text-yellow-200",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    textColor: "text-red-900 dark:text-red-100",
    titleColor: "text-red-800 dark:text-red-200",
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-900 dark:text-green-100",
    titleColor: "text-green-800 dark:text-green-200",
  },
};

export function CalloutBlock({ block }: CalloutBlockProps) {
  const config = calloutConfig[block.variant];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn(
        "rounded-lg border p-4 my-6",
        config.bgColor,
        config.borderColor
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 25,
            duration: 0.4 
          }}
          className={cn("flex-shrink-0 mt-0.5", config.iconColor)}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        <div className="flex-1 min-w-0">
          {block.title && (
            <h5 className={cn("mb-1.5 font-semibold text-sm leading-tight", config.titleColor)}>
              {block.title}
            </h5>
          )}
          <div className={cn("text-sm leading-relaxed", config.textColor)}>
            {block.content}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


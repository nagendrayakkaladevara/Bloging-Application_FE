"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, style, ...props }, ref) => {
  const internalRef = React.useRef<React.ElementRef<typeof SwitchPrimitives.Root>>(null)
  const combinedRef = React.useMemo(() => {
    if (typeof ref === "function") {
      return (node: React.ElementRef<typeof SwitchPrimitives.Root>) => {
        internalRef.current = node
        ref(node)
      }
    } else if (ref) {
      return (node: React.ElementRef<typeof SwitchPrimitives.Root>) => {
        internalRef.current = node
        ;(ref as React.MutableRefObject<React.ElementRef<typeof SwitchPrimitives.Root> | null>).current = node
      }
    }
    return (node: React.ElementRef<typeof SwitchPrimitives.Root>) => {
      internalRef.current = node
    }
  }, [ref])

  // Removed inline style overrides to let CSS variables work naturally with themes

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      style={style}
      {...props}
      ref={combinedRef}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

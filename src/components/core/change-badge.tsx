import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const changeBadgeVariants = cva(
  "inline-flex items-center justify-center rounded font-mono font-medium tabular-nums",
  {
    variants: {
      direction: {
        up: "bg-market-up/15 text-market-up",
        down: "bg-market-down/15 text-market-down",
        flat: "bg-market-flat/15 text-market-flat",
        ceiling: "bg-market-ceiling/15 text-market-ceiling",
        floor: "bg-market-floor/15 text-market-floor",
      },
      size: {
        sm: "h-4 px-1 text-[10px]",
        md: "h-5 px-1.5 text-xs",
      },
    },
    defaultVariants: {
      direction: "flat",
      size: "md",
    },
  }
)

interface ChangeBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof changeBadgeVariants> {
  value: string
}

function getDirection(value: string): "up" | "down" | "flat" {
  const num = parseFloat(value)
  if (isNaN(num) || num === 0) return "flat"
  return num > 0 ? "up" : "down"
}

function ChangeBadge({
  className,
  value,
  direction,
  size = "md",
  ...props
}: ChangeBadgeProps) {
  const resolvedDirection = direction ?? getDirection(value)

  return (
    <span
      data-slot="change-badge"
      className={cn(changeBadgeVariants({ direction: resolvedDirection, size }), className)}
      {...props}
    >
      {value}
    </span>
  )
}

export { ChangeBadge }

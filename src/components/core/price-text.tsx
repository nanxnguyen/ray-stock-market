import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const priceTextVariants = cva(
  "font-mono font-bold tabular-nums",
  {
    variants: {
      direction: {
        up: "text-market-up",
        down: "text-market-down",
        flat: "text-market-flat",
        ceiling: "text-market-ceiling",
        floor: "text-market-floor",
        reference: "text-txt-secondary",
      },
    },
    defaultVariants: {
      direction: "reference",
    },
  }
)

interface PriceTextProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof priceTextVariants> {
  value: string
}

function PriceText({
  className,
  value,
  direction = "reference",
  ...props
}: PriceTextProps) {
  return (
    <span
      data-slot="price-text"
      className={cn(priceTextVariants({ direction }), className)}
      {...props}
    >
      {value}
    </span>
  )
}

export { PriceText }

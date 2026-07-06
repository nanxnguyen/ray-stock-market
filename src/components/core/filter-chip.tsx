import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const filterChipVariants = cva(
  "inline-flex items-center gap-1 rounded-md text-sm font-medium transition-colors outline-none cursor-pointer select-none",
  {
    variants: {
      active: {
        true: "bg-blue-600 text-white",
        false: "bg-transparent text-txt-secondary border border-line hover:bg-row-hover",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

interface FilterChipProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof filterChipVariants> {
  arrow?: boolean
}

function FilterChip({
  className,
  active = false,
  children,
  arrow,
  ...props
}: FilterChipProps) {
  return (
    <button
      data-slot="filter-chip"
      data-active={active || undefined}
      className={cn(filterChipVariants({ active }), className)}
      {...props}
    >
      {children}
      {arrow && (
        <ChevronDownIcon className="size-3.5 shrink-0" />
      )}
    </button>
  )
}

export { FilterChip }
